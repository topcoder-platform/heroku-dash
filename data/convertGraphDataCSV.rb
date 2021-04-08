#!/usr/bin/ruby

require 'csv'
def writeAttribute(f, name, value, comma)
  writeAttribute2(f, name, value, comma,false);
end
def writeAttribute2(f, name, value, comma, number)

  if value.nil?
    value = ""
  end

  attribute = %q["] + name + %q[": ];
  if number
      attribute = attribute + value;
  else
    attribute = attribute +  %q["] + value +  %q["];
  end
  if(comma)
    attribute = attribute + %q[,] + "\n";
  end
  f.write(attribute);

end

  fileName = "graph-data.json"


  firstUser = true;

  if(File.exist?(fileName))
    File.delete(fileName)
  end
  user = ""
  f = open(fileName, 'w+')
  f.write("{\n");
  f.write(%q["baseline-metric": 50,]);
  f.write("\n");
  f.write(%q["baseline-metric2": 0,]);
  f.write("\n");
  f.write(%q["success-metric": 70,]);
  f.write("\n");
  f.write(%q["marathon_tester_1": 0,]);
  f.write("\n");
  f.write(%q["marathon_tester_2": 0,]);
  f.write("\n");
  f.write(%q["marathon_tester_3": 0,]);
  f.write("\n");
#  f.write(%q["success-metric2": 700000,]);
#  f.write("\n");
#  f.write(%q["max-metric": 1000000,]);
#  f.write("\n");
  f.write(%q["provisional-data": ]);
  f.write("[\n");
  if(File.exist?("graph-data.csv"))
    begin


      CSV.foreach("graph-data.csv") do |row|
        if(user != (row[1]))
          if !firstUser
            f.write("]},")
          end
          f.write(%q[{"user": {]);
          f.write("\n");

          writeAttribute(f,"rating", row[0], true);
          writeAttribute(f,"handle", row[1], true);

          writeAttribute(f,"country", row[2], true);

          avatar = row[3]
          if avatar.nil?

            avatar = "i/high_topcoder_notext.png";
          else

            avatar = avatar + ""
          end
          writeAttribute(f,"avatar", avatar, false);
          f.write(%q[}, "data": ]);
          f.write("[");
          user = row[1];
          firstUser = false
        else


          f.write(",\n");
        end
        f.write("{");
        writeAttribute(f,"date", row[4], true);
        writeAttribute2(f,"score", row[5], false,true);
        f.write("}");

      end
      f.write("]}]}")
    ensure
      f.close()
    end
  else
     f.write("]}")
  end

#end
