import { GlSprintf, GlIntersperse } from '@gitlab/ui';
import { shallowMountExtended } from 'helpers/vue_test_utils_helper';
import TimeAgo from '~/vue_shared/components/time_ago_tooltip.vue';
import { useFakeDate } from 'helpers/fake_date';
import { findDd } from 'helpers/dl_locator_helper';
import { ACCESS_LEVEL_REF_PROTECTED, ACCESS_LEVEL_NOT_PROTECTED } from '~/runner/constants';

import RunnerDetails from '~/runner/components/runner_details.vue';
import RunnerDetail from '~/runner/components/runner_detail.vue';
import RunnerGroups from '~/runner/components/runner_groups.vue';
import RunnerTags from '~/runner/components/runner_tags.vue';
import RunnerTag from '~/runner/components/runner_tag.vue';

import { runnerData, runnerWithGroupData } from '../mock_data';

const mockRunner = runnerData.data.runner;
const mockGroupRunner = runnerWithGroupData.data.runner;

describe('RunnerDetails', () => {
  let wrapper;
  const mockNow = '2021-01-15T12:00:00Z';
  const mockOneHourAgo = '2021-01-15T11:00:00Z';

  useFakeDate(mockNow);

  const findDetailGroups = () => wrapper.findComponent(RunnerGroups);

  const createComponent = ({
    props = {},
    stubs,
    mountFn = shallowMountExtended,
    ...options
  } = {}) => {
    wrapper = mountFn(RunnerDetails, {
      propsData: {
        ...props,
      },
      stubs: {
        RunnerDetail,
        ...stubs,
      },
      ...options,
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it('when no runner is present, no contents are shown', () => {
    createComponent({
      props: {
        runner: null,
      },
    });

    expect(wrapper.text()).toBe('');
  });

  describe('Details tab', () => {
    describe.each`
      field                    | runner                                                             | expectedValue
      ${'Description'}         | ${{ description: 'My runner' }}                                    | ${'My runner'}
      ${'Description'}         | ${{ description: null }}                                           | ${'None'}
      ${'Last contact'}        | ${{ contactedAt: mockOneHourAgo }}                                 | ${'1 hour ago'}
      ${'Last contact'}        | ${{ contactedAt: null }}                                           | ${'Never contacted'}
      ${'Version'}             | ${{ version: '12.3' }}                                             | ${'12.3'}
      ${'Version'}             | ${{ version: null }}                                               | ${'None'}
      ${'Executor'}            | ${{ executorName: 'shell' }}                                       | ${'shell'}
      ${'Architecture'}        | ${{ architectureName: 'amd64' }}                                   | ${'amd64'}
      ${'Platform'}            | ${{ platformName: 'darwin' }}                                      | ${'darwin'}
      ${'IP Address'}          | ${{ ipAddress: '127.0.0.1' }}                                      | ${'127.0.0.1'}
      ${'IP Address'}          | ${{ ipAddress: null }}                                             | ${'None'}
      ${'Configuration'}       | ${{ accessLevel: ACCESS_LEVEL_REF_PROTECTED, runUntagged: true }}  | ${'Protected, Runs untagged jobs'}
      ${'Configuration'}       | ${{ accessLevel: ACCESS_LEVEL_REF_PROTECTED, runUntagged: false }} | ${'Protected'}
      ${'Configuration'}       | ${{ accessLevel: ACCESS_LEVEL_NOT_PROTECTED, runUntagged: true }}  | ${'Runs untagged jobs'}
      ${'Configuration'}       | ${{ accessLevel: ACCESS_LEVEL_NOT_PROTECTED, runUntagged: false }} | ${'None'}
      ${'Maximum job timeout'} | ${{ maximumTimeout: null }}                                        | ${'None'}
      ${'Maximum job timeout'} | ${{ maximumTimeout: 0 }}                                           | ${'0 seconds'}
      ${'Maximum job timeout'} | ${{ maximumTimeout: 59 }}                                          | ${'59 seconds'}
      ${'Maximum job timeout'} | ${{ maximumTimeout: 10 * 60 + 5 }}                                 | ${'10 minutes 5 seconds'}
    `('"$field" field', ({ field, runner, expectedValue }) => {
      beforeEach(() => {
        createComponent({
          props: {
            runner: {
              ...mockRunner,
              ...runner,
            },
          },
          stubs: {
            GlIntersperse,
            GlSprintf,
            TimeAgo,
          },
        });
      });

      it(`displays expected value "${expectedValue}"`, () => {
        expect(findDd(field, wrapper).text()).toBe(expectedValue);
      });
    });

    describe('"Tags" field', () => {
      const stubs = { RunnerTags, RunnerTag };

      it('displays expected value "tag-1 tag-2"', () => {
        createComponent({
          props: {
            runner: { ...mockRunner, tagList: ['tag-1', 'tag-2'] },
          },
          stubs,
        });

        expect(findDd('Tags', wrapper).text().replace(/\s+/g, ' ')).toBe('tag-1 tag-2');
      });

      it('displays "None" when runner has no tags', () => {
        createComponent({
          props: {
            runner: { ...mockRunner, tagList: [] },
          },
          stubs,
        });

        expect(findDd('Tags', wrapper).text().replace(/\s+/g, ' ')).toBe('None');
      });
    });

    describe('Group runners', () => {
      beforeEach(() => {
        createComponent({
          props: {
            runner: mockGroupRunner,
          },
        });
      });

      it('Shows a group runner details', () => {
        expect(findDetailGroups().props('runner')).toEqual(mockGroupRunner);
      });
    });
  });

  describe('Jobs tab slot', () => {
    it('shows job tab slot', () => {
      const JOBS_TAB = '<div>Jobs Tab</div>';

      createComponent({
        slots: {
          'jobs-tab': JOBS_TAB,
        },
      });

      expect(wrapper.html()).toContain(JOBS_TAB);
    });
  });
});
