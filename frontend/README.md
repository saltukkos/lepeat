# TODO
1. Add new words
    1. Group by Term definition
    2. one group - one table
2. Edit/delete words (separate page table)
3. Statistics (debug)
    1. All words (as rows), all Trainings (as colums); cell - iterationNumber + lastTrainDate
4. Statistic (normal)
    1. Graphic per training
    2. Didn't learn - 100 words; 1 iteration - 20 words; 2 iteration - 30 words; etc.
5. Persistence
    1. Save data to local storage
    2. Add import\export to share data between devices
    3. Add "merge" option for conflicts


# Workflow
1. Backlog
   1. Appearance:
      1. Table with all terms that are not in study
      2. For each row button "To learn"
      3. Bucket operations "First 10/20 to learn"
2. Learn
   1. Buttons + Flow
      1. Move to repeat (easy)
      2. Know - next iteration or to repeat
      3. Dont know - 0 iteration
3. Repeat
   1. Buttons + Flow
      1. Know - next iteration (+1)
      2. Hardly know - same iteration
      3. Super good - next next iteration (+2)
      4. Don't know - move to last iteration of learn and mark the card with `relearn` flag
4. (Hidden) Relearn
   1. Buttons + Flow
      1. Know - restore - 1
      2. Dont know - learn 0 iteration

## TODO
1. Add button "To learn" on place where we create a new word (skip backlog stage)
2. Support possibility to move word to 0 learn iteration e.g. via word editor page. 
In case client sees the word between iterations and understands he forgot the word.

