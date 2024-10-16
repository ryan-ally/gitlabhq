# frozen_string_literal: true

class ProjectHook < WebHook
  include TriggerableHooks
  include Presentable
  include Limitable
  extend ::Gitlab::Utils::Override

  self.limit_scope = :project

  triggerable_hooks [
    :push_hooks,
    :tag_push_hooks,
    :issue_hooks,
    :confidential_issue_hooks,
    :note_hooks,
    :confidential_note_hooks,
    :merge_request_hooks,
    :job_hooks,
    :pipeline_hooks,
    :wiki_page_hooks,
    :deployment_hooks,
    :feature_flag_hooks,
    :release_hooks
  ]

  belongs_to :project
  validates :project, presence: true

  def pluralized_name
    _('Webhooks')
  end

  override :application_context
  def application_context
    super.merge(project: project)
  end

  override :parent
  def parent
    project
  end

  private

  override :web_hooks_disable_failed?
  def web_hooks_disable_failed?
    Feature.enabled?(:web_hooks_disable_failed, project)
  end
end

ProjectHook.prepend_mod_with('ProjectHook')
