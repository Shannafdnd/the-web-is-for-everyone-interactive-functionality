// *** Express setup en start ***

import express from 'express'
import fetchJson from './helpers/fetch-json.js'

const app = express()

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

// Detail route op /article/:slug
app.get('/article/:slug', function (request, response){

  fetchJson( `${apiUrl}posts?slug=${request.params.slug}`).then((apiData) => {
     response.render('article', 
     {post: apiData[0], categories, yoast_head: apiData[0].yoast_head});
   })
})

// catogory page
app.get('/categorie/:slug', function (request, response) {
  const category = categories.find((category) => category.slug == request.params.slug);
  // Vind de categorie, waarvan de slug gelijk is aan de aangevraagde slug.
  Promise.all([fetchJson(`${apiUrl}posts?categories=${category.id}`), fetchJson(categoriesUrl + '/?slug=' + request.params.slug)]).then(([postData, category]) =>{ // Door promise.all te gebruiken, kan je meerdere fetches tegelijk doen

    response.render('category', {posts: postData, category, categories});
  })
})