# frozen_string_literal: true

require 'sidekiq/api'

module API
  class SidekiqMetrics < ::API::Base
    before { authenticated_as_admin! }

    feature_category :not_owned # rubocop:todo Gitlab/AvoidFeatureCategoryNotOwned

    helpers do
      def queue_metrics
        ::Gitlab::SidekiqConfig.routing_queues.each_with_object({}) do |queue_name, hash|
          queue = Sidekiq::Queue.new(queue_name)
          hash[queue.name] = {
            backlog: queue.size,
            latency: queue.latency.to_i
          }
        end
      end

      def process_metrics
        Sidekiq::ProcessSet.new(false).map do |process|
          {
            hostname:    process['hostname'],
            pid:         process['pid'],
            tag:         process['tag'],
            started_at:  Time.at(process['started_at']),
            queues:      process['queues'],
            labels:      process['labels'],
            concurrency: process['concurrency'],
            busy:        process['busy']
          }
        end
      end

      def job_stats
        stats = Sidekiq::Stats.new
        {
          processed: stats.processed,
          failed: stats.failed,
          enqueued: stats.enqueued,
          dead: stats.dead_size
        }
      end
    end

    desc 'Get the Sidekiq queue metrics'
    get 'sidekiq/queue_metrics' do
      { queues: queue_metrics }
    end

    desc 'Get the Sidekiq process metrics'
    get 'sidekiq/process_metrics' do
      { processes: process_metrics }
    end

    desc 'Get the Sidekiq job statistics'
    get 'sidekiq/job_stats' do
      { jobs: job_stats }
    end

    desc 'Get the Sidekiq Compound metrics. Includes queue, process, and job statistics'
    get 'sidekiq/compound_metrics' do
      { queues: queue_metrics, processes: process_metrics, jobs: job_stats }
    end
  end
end
