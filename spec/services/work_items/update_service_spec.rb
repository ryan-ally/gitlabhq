# frozen_string_literal: true

require 'spec_helper'

RSpec.describe WorkItems::UpdateService do
  let_it_be(:developer) { create(:user) }
  let_it_be(:project) { create(:project).tap { |proj| proj.add_developer(developer) } }
  let_it_be_with_reload(:work_item) { create(:work_item, project: project, assignees: [developer]) }

  let(:spam_params) { double }
  let(:widget_params) { {} }
  let(:opts) { {} }
  let(:current_user) { developer }

  describe '#execute' do
    subject(:update_work_item) { described_class.new(project: project, current_user: current_user, params: opts, spam_params: spam_params, widget_params: widget_params).execute(work_item) }

    before do
      stub_spam_services
    end

    context 'when title is changed' do
      let(:opts) { { title: 'changed' } }

      it 'triggers issuable_title_updated graphql subscription' do
        expect(GraphqlTriggers).to receive(:issuable_title_updated).with(work_item).and_call_original
        expect(Gitlab::UsageDataCounters::WorkItemActivityUniqueCounter).to receive(:track_work_item_title_changed_action).with(author: current_user)
        # During the work item transition we also want to track work items as issues
        expect(Gitlab::UsageDataCounters::IssueActivityUniqueCounter).to receive(:track_issue_title_changed_action)

        update_work_item
      end
    end

    context 'when title is not changed' do
      let(:opts) { { description: 'changed' } }

      it 'does not trigger issuable_title_updated graphql subscription' do
        expect(GraphqlTriggers).not_to receive(:issuable_title_updated)
        expect(Gitlab::UsageDataCounters::WorkItemActivityUniqueCounter).not_to receive(:track_work_item_title_changed_action)

        update_work_item
      end
    end

    context 'when updating state_event' do
      context 'when state_event is close' do
        let(:opts) { { state_event: 'close' } }

        it 'closes the work item' do
          expect do
            update_work_item
            work_item.reload
          end.to change(work_item, :state).from('opened').to('closed')
        end
      end

      context 'when state_event is reopen' do
        let(:opts) { { state_event: 'reopen' } }

        before do
          work_item.close!
        end

        it 'reopens the work item' do
          expect do
            update_work_item
            work_item.reload
          end.to change(work_item, :state).from('closed').to('opened')
        end
      end
    end

    context 'when updating widgets' do
      context 'for the description widget' do
        let(:widget_params) { { description_widget: { description: 'changed' } } }

        it 'updates the description of the work item' do
          update_work_item

          expect(work_item.description).to eq('changed')
        end
      end
    end
  end
end
