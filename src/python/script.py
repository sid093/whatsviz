import sys
import json
import os
import re


pattern = '^(\\d\\d\\/\\d\\d\\/\\d\\d), (\\d?\\d:\\d\\d ..) - (.+?): (.*)$'

args = sys.argv
if(len(args) != 3):
    print('Provide the input/output chat file as a command line argument!')
    sys.exit()


file_in = args[1]
file_out = args[2]

with open(file_in, "r", encoding="utf8") as fh:
    lines = fh.readlines()

output = []

for line in lines:
    matches = re.findall(pattern, line)
    if(len(matches) > 0):
        converted_line = {
            "date": matches[0][0],
            "time": matches[0][1],
            "sender": matches[0][2],
            "text": matches[0][3]
        }
        output.append(converted_line)
    else:
      output[len(output) - 1]['text'] += line


out_file = open(file_out, "w")
json.dump(output, out_file, indent=4, sort_keys=False)
out_file.close()

os.remove(file_in)
