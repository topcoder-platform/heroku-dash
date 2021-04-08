#!/usr/bin/ruby

require 'csv'

fileName = "challenge-submission-text-formatted.csv"

begin
  text = File.read(fileName)
    puts text
    text = text.gsub(/removeme,(.*?)"/, "")
    text = text.gsub(/", *"/, ",")
    text = text.gsub(/"(.*?)$/, "")
    text = text.gsub(/\(constant\),/, "")
    text = text.gsub(//, "")

       puts text
  File.open(fileName, "w") {|file| file.puts text}
end

submissionFile = "challenge-submissions.json"
submissions = File.read(submissionFile)
begin
    CSV.foreach("challenge-submission-text-formatted.csv") do |row|
      puts row.count
      subLinks = ""
      i = 3
      while i < row.count do
      puts row[i]
       if i!=3 then
         subLinks = subLinks + ", " 
       end

      subLinks =  subLinks + row[i]
       i = i + 1
      end
      regex = Regexp.new row[2] #subLinks

      puts "links: " + subLinks
      submissions = submissions.gsub(regex, subLinks)

    end

end
File.open(submissionFile, "w") {|file| file.puts submissions}
