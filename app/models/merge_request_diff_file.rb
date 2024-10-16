# frozen_string_literal: true

class MergeRequestDiffFile < ApplicationRecord
  extend SuppressCompositePrimaryKeyWarning

  include BulkInsertSafe
  include Gitlab::EncodingHelper
  include DiffFile

  belongs_to :merge_request_diff, inverse_of: :merge_request_diff_files
  alias_attribute :index, :relative_order

  scope :by_paths, ->(paths) do
    where("new_path in (?) OR old_path in (?)", paths, paths)
  end

  def utf8_diff
    fetched_diff = diff

    return '' if fetched_diff.blank?

    encode_utf8(fetched_diff) if fetched_diff.respond_to?(:encoding)
  end

  def diff
    content =
      if merge_request_diff&.stored_externally?
        merge_request_diff.opening_external_diff do |file|
          file.seek(external_diff_offset)
          force_encode_utf8(file.read(external_diff_size))
        end
      else
        super
      end

    return content unless binary?

    # If the data isn't valid base64, return it as-is, since it's almost certain
    # to be a valid diff. Parsing it as a diff will fail if it's something else.
    #
    # https://gitlab.com/gitlab-org/gitlab/-/issues/240921
    begin
      content.unpack1('m0')
    rescue ArgumentError
      content
    end
  end

  # This method is meant to be used during Project Export.
  # It is identical to the behaviour in #diff & #utf8_diff with the only
  # difference of caching externally stored diffs on local disk in
  # temp storage location in order to improve diff export performance.
  def diff_export
    return utf8_diff unless Feature.enabled?(:externally_stored_diffs_caching_export)
    return utf8_diff unless merge_request_diff&.stored_externally?

    content = merge_request_diff.cached_external_diff do |file|
      file.seek(external_diff_offset)

      force_encode_utf8(file.read(external_diff_size))
    end

    # See #diff
    if binary?
      content = begin
        content.unpack1('m0')
      rescue ArgumentError
        content
      end
    end

    if content.respond_to?(:encoding)
      content = encode_utf8(content)
    end

    return '' if content.blank?

    content
  rescue StandardError
    utf8_diff
  end
end
