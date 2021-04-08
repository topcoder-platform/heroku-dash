#!/usr/bin/ruby

require 'csv'

  fileName = "challenge-status.json"

  rowCount = 1
  f = File.open(fileName)
  text = f.read
  begin
    CSV.foreach("challenge-status.csv") do |row|

      if(rowCount == 1)
         puts "row 1 - " + row[0] +" " + row[1] + " " + row[2]

         text = text.gsub(/registrants": [0-9]+/, %q[registrants": ] + row[2])
         puts "hello "
         rowCount = 2
      else
        puts "else " + row[0] + " " + row[1] + " " + row[2]
         text = text.gsub(/submitters": [0-9]+/, %q[submitters": ] + row[0])
         text = text.gsub(/total-submissions": [0-9]+/, %q[total-submissions": ] + row[1])
         puts text
      end
    end

    puts "final"
    puts text
    puts "done"
    File.open(fileName, "w") {|file| file.puts text}



end
