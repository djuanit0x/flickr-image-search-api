import React, { useEffect } from "react"
import axios from "axios"
import Layout from "../components/layout"
import SEO from "../components/seo"
import styles from "../styles/index.module.css"

const IndexPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [searchClicked, setSearchClicked] = React.useState(false)
  const [images, setImages] = React.useState(null)
  const [imagesUrl, setImagesUrl] = React.useState(null)

  const handleChange = event => {
    setSearchTerm(event.target.value)
  }

  const handleSeachClick = () => {
    setSearchClicked(!searchClicked)
  }

  useEffect(() => {
    if (!images) {
      axios(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=kittens`
      ).then(result => {
        if (result.status !== 200) {
          console.error("Unable to load the images")
          return
        }

        setImages(result.data.photos.photo)
      })
      return // Finish retrieving all of possible images from flickr API
    }

    // No images to shown when search is not performed
    if (searchTerm.length === 0) {
      setImagesUrl(null)
      return
    }

    const imagesUrlFromSeach = [] // start with empty list for every single seach
    images.forEach(image => {
      let { farm, server, id, secret, title } = image
      if (title.toLowerCase().includes(searchTerm.toLowerCase())) {
        imagesUrlFromSeach.push(
          `http://farm${farm}.static.flickr.com/${server}/${id}_${secret}.jpg`
        )
      }
    })

    setImagesUrl(imagesUrlFromSeach)

    return () => {
      // reset the search button
      setSearchClicked(false)
    }
  }, [searchClicked])

  return (
    <Layout>
      <SEO title="Home" />
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <button onClick={handleSeachClick}>Seach</button>
      {imagesUrl ? (
        <div className={styles.imagesUrl}>
          {imagesUrl.map(imageUrl => (
            <div className={styles.image} key={imageUrl}>
              <img src={imageUrl} alt="" />
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No images to be shown...</p>
      )}
      {
        // Note: At this point, I am not sure what I have to fetch as
        // I have fetched all of the image based on the user search
      }
      <button>Fetch More</button>
    </Layout>
  )
}

export default IndexPage
