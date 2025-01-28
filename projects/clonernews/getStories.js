// Base Firebase URL for Hacker News API
const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

//? Fetch the topstories link to get all stories ids in an array
export async function fetchTopStories(start = 0) {
  try {
    const response = await fetch(`${BASE_URL}newstories.json`);
    // Converting response to json
    const storyIds = await response.json();
    // console.log(storyIds)
    // Returning a slice of stories ids to avoid spending too much time getting everything
    return storyIds.slice(start, start + 20);
  } catch (error) {
    console.error('Error fetching top stories:', error);
  }
}

//? Fetch details from the id given
export async function fetchItemDetails(itemId) {
  try {
    // Fetching the data from the link with the id given and storing that response into a variable
    const response = await fetch(`${BASE_URL}item/${itemId}.json`);
    // Parsing the response to a json format
    return await response.json();

    // Catch any type of errors that might occur
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
  }
}

//? Get top stories with their full details
export async function getTopStoriesWithDetails(start = 0) {
  try {
    // Calling the fetch stories func to get the array containing all the stories
    const storyIds = await fetchTopStories(start);
    // console.log(storyIds)
    const stories = await Promise.all(
      storyIds.map(id => fetchItemDetails(id))
    );
    return stories;
  } catch (error) {
    console.error('Error getting top stories with details:', error);
  }
}

export async function fetchTopJobs(start = 0){
  try {
    const response = await fetch(`${BASE_URL}jobstories.json`);
    // Converting response to json
    const storyIds = await response.json();
    // console.log(storyIds)
    // Returning a slice of stories ids to avoid spending too much time getting everything
    return storyIds.slice(start, start + 20);
  } catch (error) {
    console.error('Error fetching top stories:', error);
  }
}

//? Get top stories with their full details
export async function getTopJobsWithDetails(start = 0) {
  try {
    // Calling the fetch stories func to get the array containing all the stories
    const storyIds = await fetchTopJobs(start);
    console.log(storyIds)
    const stories = await Promise.all(
      storyIds.map(id => fetchItemDetails(id))
    );
    return stories;
  } catch (error) {
    console.error('Error getting top jobs with details:', error);
  }
}