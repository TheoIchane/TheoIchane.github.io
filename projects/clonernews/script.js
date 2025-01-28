import { getTopStoriesWithDetails, getTopJobsWithDetails, fetchItemDetails, fetchTopStories, fetchTopJobs } from './getStories.js'

// Main func to generate the divs of the news
export async function stories(func = getTopStoriesWithDetails,start = 0) {
  f = func
  // Fetching top stories details
  const topStories = await func(start);
  // console.log('Top Stories:', topStories);
  if (start == 0) {
    previousStory = topStories[0].id
  }
  
  
  // Ranging over the object containing our slice of stories
  for (let i = 0; i < topStories.length; i++) {
      let newDiv = document.createElement('div');
      newDiv.setAttribute('data-story', topStories[i].id);
      newDiv.setAttribute('id', 'stories')

      let title = document.createElement('a');
      title.textContent = topStories[i].title;
      title.href = topStories[i].url;
      newDiv.appendChild(title);

      const date = new Date((topStories[i].time + 3600) * 1000)
      let details = [
          { label: 'by', value: topStories[i].by },
          // { label: 'Score', value: topStories[i].score },
          // { label: '', value: topStories[i].text },
          { label: '', value: date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC',
            timeZoneName: 'short'
        }) },
          // { label: 'Comments', value: topStories[i].descendants },
      ];

      // Creating an <a> HTML element for each details
      details.forEach(detail => {
          let detailEl = document.createElement('a');
          detailEl.textContent = `${detail.label} ${detail.value}`;
          newDiv.appendChild(detailEl);
      });

      if (topStories[i].kids != undefined) {
        for (let j = 0; j < topStories[i].kids.length; j++) {
          let commentDetails = await fetchItemDetails(topStories[i].kids[j])
          // console.log(commentDetails);
          let commentDiv = document.createElement('div');
          commentDiv.setAttribute('class', 'comment')

          let by = document.createElement('a');
          by.textContent = commentDetails.by
          by.setAttribute('class', 'comment-author')
          commentDiv.appendChild(by)

          let text = document.createElement('a');
          text.setAttribute('class', 'comment-text')
          text.textContent = commentDetails.text
          commentDiv.appendChild(text)

          newDiv.appendChild(commentDiv)
        } 
      }

      // Appending the created div to the HTML body
      document.body.appendChild(newDiv);
  }
}

window.addEventListener('scroll', () => {  
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-1) {
    if (reset) {
      start += 20
      stories(f,start)
      reset = false
    }
    setTimeout(() => reset = true,300)
  }
});

let f = getTopStoriesWithDetails
let start = 0
let reset = true
stories()

let button = document.getElementById('categorieSelector')
button.addEventListener('click', (test) => {
  console.log(test.srcElement.id);

  if (test.srcElement.id == 'newsButton') {
    actualButton = 'Stories'
    increment = 0
    remove()
    let element = document.getElementById('newsButton')
    element.innerHTML = 'Stories'
    stories(getTopStoriesWithDetails)
  } else if (test.srcElement.id == 'jobsButton') {
    actualButton = 'Jobs'
    increment = 0
    remove()
    let element = document.getElementById('jobsButton')
    element.innerHTML = 'Jobs'
    stories(getTopJobsWithDetails)
  } else if (test.srcElement.id == 'counter-button') {
    remove()
    let element = document.getElementById('counter-button')
    element.innerHTML = 'No new story'
    stories(getTopStoriesWithDetails)
  }
})

//? Function to clean the body before displaying new button infos
function remove() {
  let elements = document.querySelectorAll('#stories')
  for (let i = 0; i < elements.length; i++) {
    document.body.removeChild(elements[i])
  }
}
let actualButton = 'Stories'
let increment = 0
let previousStory
setInterval(async () => {
  if (actualButton == 'Stories') {
    let story = await fetchTopStories(0)
    if (story[0] != previousStory) {
      increment++
    }
    previousStory = story[0]
    
    let element = document.getElementById('newsButton')
    if (increment > 0) {
      element.innerHTML = 'Stories (' + increment + ')'
    }
  }
}, 5000);

setInterval(async () => {
  if (actualButton == 'Jobs') {
    let story = await fetchTopJobs(0)
    if (story[0] != previousStory) {
      increment++
    }
    previousStory = story[0]
    
    let element = document.getElementById('jobsButton')
    if (increment > 0) {
      element.innerHTML = 'Jobs (' + increment + ')'
    }
  }
}, 5000);
