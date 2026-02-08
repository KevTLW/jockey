#!/usr/bin/env python3
import os

file_path = 'components/party/song.tsx'

with open(file_path, 'r') as f:
    content = f.read()

old_text = '''        <div className={`mt-2 justify-center gap-1.5 ${type === "request" && isHost ? "grid grid-cols-2" : "flex flex-wrap"}`}>
          <Button
            theme="positive-inverse"
            className="!p-1.5 flex items-center justify-center"
            onClick={handleRequesting}
          >
            <HandThumbUpIcon className="h-4 w-4" />
          </Button>

          <Button
            theme="danger-inverse"
            className="!p-1.5 flex items-center justify-center"
            onClick={handleUnrequesting}
          >
            <HandThumbDownIcon className="h-4 w-4" />
          </Button>

          <a'''

new_text = '''        <div className={`mt-2 justify-center gap-1.5 ${type === "request" && isHost ? "grid grid-cols-2" : "flex flex-wrap"}`}>
          {!userHasLiked && (
            <Button
              theme="positive-inverse"
              className="!p-1.5 flex items-center justify-center"
              onClick={handleRequesting}
            >
              <HandThumbUpIcon className="h-4 w-4" />
            </Button>
          )}

          {userHasLiked && (
            <Button
              theme="danger-inverse"
              className="!p-1.5 flex items-center justify-center"
              onClick={handleUnrequesting}
            >
              <HandThumbDownIcon className="h-4 w-4" />
            </Button>
          )}

          <a'''

if old_text in content:
    content = content.replace(old_text, new_text)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Successfully updated song.tsx!")
else:
    print("Old text not found in file!")
