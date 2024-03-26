// *** Express setup en start ***

import express, { request, response } from 'express'
import fetchJson from './helpers/fetch-json.js'

const app = express();

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.set('port', process.env.PORT || 8000)
app.use(express.urlencoded({extended: true}))

app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


//*** Data ***
const apiUrl = 'https://redpers.nl/wp-json/wp/v2/'
const directus_url = 'https://fdnd-agency.directus.app/items/redpers_shares'
const postsUrl = apiUrl + 'posts'
const categoriesUrl = apiUrl+ 'categories'
const categories = [
  {"id": 9, "name": "Binnenland", "slug": "binnenland"},
  {"id": 1010, "name": "Buitenland", "slug": "buitenland"}, 
  {"id": 10, "name": "Columns", "slug": "columns"},
  {"id": 6, "name": "Economie", "slug": "economie"},
  {"id": 4, "name": "Kunst & Media", "slug": "kunst-media"},
  {"id": 3211, "name": "Podcasts", "slug": "podcast"},
  {"id": 63, "name": "Politiek", "slug": "politiek"},
  {"id": 94, "name": "Wetenshap", "slug": "wetenschap"},
];

// *** Routes ***

// Index
app.get('/', (request, response) => {

    Promise.all(
      [fetchJson(`${apiUrl}posts?per_page=4`)]
      .concat(categories.map((category) => fetchJson(`${apiUrl}posts?per_page=3&categories=${category.id}`))) 
    ).then((apiData) => { // apiData is een array van arrays van posts.
      response.render('index', 
      {posts: apiData, categories, title: "Red pers - Podium voor de Journalistiek"});
    })
  })

// Author page
app.get('/author/:id', function (request, response){
  fetchJson( `${apiUrl}posts?author=${request.params.id}`).then((apiData) => {
      response.render('author', 
     {posts: apiData, categories});
   })
})

// Post page
app.get('/post/:slug', function (request, response){
  Promise.all([
    fetchJson( `${apiUrl}posts?slug=${request.params.slug}`),
    fetchJson(`${directus_url}?filter[slug][_eq]=${request.params.slug}`)
  ]).then(([apiData,{data}]) => {
    response.render('post', 
    {post: apiData[0], shares: data[0]?.shares ?? 0, categories, yoast_head: apiData[0].yoast_head});
  })
})

app.post('/post/:slug', (request, response) => {
  fetchJson(`${directus_url}?filter[slug][_eq]=${request.params.slug}`).then(({ data }) => {
    // Doe een PATCH op directus, stuur de id mee als die er is.
    fetchJson(`${directus_url}/${data[0]?.id ? data[0].id : ''}`, {
      method: data[0]?.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: request.params.slug,
        shares: data.length > 0 ? data[0].shares + 1 : 1,
      }),
    })
  })
  response.redirect(301, `/post/${request.params.slug}`)
})

// catogory page
app.get('/categorie/:slug', function (request, response) {
  const category = categories.find((category) => category.slug == request.params.slug);
  // Vind de categorie, waarvan de slug gelijk is aan de aangevraagde slug.
  Promise.all([fetchJson(`${apiUrl}posts?categories=${category.id}`), fetchJson(categoriesUrl + '/?slug=' + request.params.slug)]).then(([postData, category]) =>{ // Door promise.all te gebruiken, kan je meerdere fetches tegelijk doen

    response.render('category', {posts: postData, category, categories});
  })
})