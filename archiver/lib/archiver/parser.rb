module Archiver
  class Parser
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def occurrences
      @occurrences ||= data.reject { |hsh| hsh.has_key?(:failure) }
    end

    def normalized
      @normalized ||= occurrences.map { |hsh| normalize(hsh) }
    end

    def normalize(hsh)
      dt = split_date(hsh[:date])

      dt[:date] = dt[:date].map { |date| Chronic.parse(date) }

      a, b = dt[:date].first, dt[:date].last # Will be identical if a single day event
      c    = (a && b ? (a.to_datetime + ((b.to_datetime - a.to_datetime).to_i / 2)) : dt[:date].first)

      a, b, c = [a, b, c].map { |x| x.strftime("%F").split("-") }

      d = { starting: dt[:time].first.split(":"), ending: dt[:time].last.split(":") } unless dt[:time].nil?

      hsh.merge({ starting: a, ending: b, mid: c, time: d })
    end

    # Example input
    # => "January 12 2013"
    # => "January 18 2013 at 19:00"
    # => "March 8 - March 9 2012"
    # => "October 27 2000 - January 21 2001"
    # => "after May 3 2001"
    # => "October 13 2012 at 15:00 - 16:00"
    # => "2002"
    def split_date(string)
      case string
        when /\sat\s/
          split = string.split(" at ")
          { date: normalize_date_pair([split.first]), time: split.last.split(" - ") }
        when /\s-\s/
          { date: normalize_date_pair(string.split(" - ")), time: nil }
        when /^after /
          { date: normalize_date_pair([string.gsub("after", "").strip]), time: nil }
        else
          { date: normalize_date_pair([string]), time: nil }
      end
    end

    def bare_year?(string)
      string =~ /(^\d{4}$)/
    end

    def full_year?(pair)
      pair.size == 1 && bare_year?(pair.first)
    end

    def full_year!(pair)
      ["January 1 #{pair.first}", "December 31 #{pair.first}"]
    end

    # Accepts a two-element Array of strings, and gets a single year from the pair.
    # Maps over the array and if the item has a year already; leave it alone.
    # If not then assume it's the year we've parsed out.
    def normalize_date_pair(pair)
      pair = full_year!(pair) if full_year?(pair)

      year = pair.map do |x|
        x.match(/\d{4}/).to_s
      end.reject(&:empty?).first

      pair.map do |x|
        x =~ /\d{4}/ ? x : "#{x} #{year}"
      end
    end
  end # Parser
end # Archiver
