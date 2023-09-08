import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router'
import { ReactSortable } from 'react-sortablejs'
import Spinner from './Spinner'
import { useSession } from 'next-auth/react'

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')
  const [goToProducts, setGoToProducts] = useState(false)
  const [images, setImages] = useState(existingImages || [])
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(assignedCategory || '')
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  )
  const { data: session } = useSession()
  const [error, setError] = useState()

  const router = useRouter()

  useEffect(() => {
    try {
      axios.get('/api/category').then((result) => {
        setCategories(result.data)
      })
    } catch (error) {
      setError(error)
    }
  }, [])

  async function createProduct(e) {
    e.preventDefault()
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
      seller: session?.user._id,
    }

    try {
      if (_id) {
        await axios.put('/api/products', { ...data, _id })
      } else {
        await axios.post('/api/products', data)
      }
    } catch (error) {
      return error
    }
    setGoToProducts(true)
  }

  if (goToProducts) {
    router.push('/products')
  }

  async function uploadImages(ev) {
    const files = ev.target?.files
    try {
      if (files?.length > 0) {
        setIsUploading(true)
        const data = new FormData()
        for (const file of files) {
          data.append('file', file)
        }
        const res = await axios.post('/api/upload', data)
        // , {
        //   headers: { 'Content-Type': 'multipart/form-data' },
        // }
        setImages((oldImages) => {
          return [...oldImages, ...res.data.links]
        })
        setIsUploading(false)
      }
    } catch (error) {
      setError(error)
    }
  }

  function updateImagesOrder(images) {
    setImages(images)
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev }
      newProductProps[propName] = value
      return newProductProps
    })
  }

  const propertiesToFill = []
  if (categories.length > 0 && category) {
    let categoryInfo = categories.find(({ _id }) => _id === category)
    propertiesToFill.push(...categoryInfo.properties)
    while (categoryInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === categoryInfo?.parent?._id
      )
      propertiesToFill.push(...parentCat.properties)
      categoryInfo = parentCat
    }
  }
  console.log(error)

  return (
    <form onSubmit={createProduct}>
      <fieldset className="mb-5 lg:mb-8">
        {/* <legend className="mb-3 text-contrast-higher text-lg">
          Add new Product
        </legend> */}

        <div className="grid grid-cols-12 gap-3 lg:gap-5">
          <div className="col-span-12">
            <label
              className="inline-block text-sm mb-1.5 lg:mb-2"
              htmlFor="input-name"
            >
              Product Name
            </label>
            <input
              className="appearance-none bg-white border border-gray-300 py-2 px-3 rounded-md text-[1em] leading-tight transition duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-indigo-700 w-full"
              type="text"
              name="input-name"
              id="input-name"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="col-span-12">
            <label>Category</label>
            <select
              value={category}
              onChange={(ev) => setCategory(ev.target.value)}
            >
              <option value="">Uncategorized</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
            {propertiesToFill.length > 0 &&
              propertiesToFill.map((p, i) => (
                <div key={i} className="">
                  <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                  <div>
                    <select
                      value={productProperties[p.name]}
                      onChange={(ev) => setProductProp(p.name, ev.target.value)}
                    >
                      {p.values.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
          </div>

          {/* {
            categories.length > 0 && (
              <div></div>
            )
          } */}

          <div className="col-span-12">
            <label
              className="inline-block text-sm mb-1.5 lg:mb-2"
              htmlFor="input-name"
            >
              Images
            </label>
            {/* <input
              className="appearance-none bg-white border border-gray-300 py-2 px-3 rounded-md text-[1em] leading-tight transition duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-indigo-700 w-full"
              type="text"
              name="input-name"
              id="input-name"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            /> */}
            <div className="mb-2 flex flex-wrap gap-2">
              <ReactSortable
                className="flex flex-wrap gap-2"
                list={images}
                setList={updateImagesOrder}
              >
                {!!images?.length &&
                  images.map((link, i) => (
                    <div
                      key={i}
                      className="h-24 bg-white p-2 shadow-sm rounded-lg border border-gray-200"
                    >
                      <img src={link} alt="image" className="rounded-lg" />
                    </div>
                  ))}
              </ReactSortable>
              {isUploading && (
                <div className="h-24 flex items-center">
                  <Spinner />
                </div>
              )}
              <label className="w-24 cursor-pointer h-24 bg-white shadow-md border border-primary text-center flex flex-col items-center justify-center text-sm text-primary rounded-lg gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <p>Upload</p>
                <input type="file" onChange={uploadImages} className="hidden" />
              </label>
            </div>
          </div>

          {/* <div className="col-span-12 lg:col-span-6">
        <label className="inline-block text-sm mb-1.5 lg:mb-2" htmlFor="input-email">Email</label>
        <input className="appearance-none bg-white border border-gray-300 py-2 px-3 rounded-md text-[1em] leading-tight transition duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-indigo-700 w-full" type="email" name="input-email" id="input-email" placeholder="email@myemail.com" />
      </div> */}
          {/* 
      <div className="col-span-12">
        <label className="inline-block text-sm mb-1.5 lg:mb-2" htmlFor="input-invalid">Invalid</label>
        <input className="w-full appearance-none bg-white border border-red-600 py-2 px-3 rounded-md text-[1em] leading-tight transition-all duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-red-600" type="text" name="input-invalid" id="input-invalid" aria-invalid="true" value="invalid data" />
        <div className="bg-red-600/20 p-2 lg:p-3 rounded text-sm lg:text-base text-gray-900 mt-1.5 lg:mt-2" role="alert"><p><strong>Error:</strong> this is an error message</p></div>
      </div> */}

          <div className="col-span-12">
            <label
              className="inline-block text-sm mb-1.5 lg:mb-2"
              htmlFor="textarea"
            >
              Product Description
            </label>
            <textarea
              className="appearance-none bg-white border border-gray-300 py-2 px-3 rounded-md text-[1em] leading-tight transition duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-indigo-700 w-full"
              name="textarea"
              id="textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1.5 lg:mt-2">
              Use helper text to provide additional information.
            </p>
          </div>

          <div className="col-span-12">
            <label
              className="inline-block text-sm mb-1.5 lg:mb-2"
              htmlFor="input-name"
            >
              Product Price
            </label>
            <input
              className="appearance-none bg-white border border-gray-300 py-2 px-3 rounded-md text-[1em] leading-tight transition duration-200 outline-none placeholder:opacity-100 placeholder:text-gray-400 focus-within:border-indigo-700 w-full"
              type="number"
              min="1"
              placeholder="$0"
              name="input-price"
              id="input-price"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          className="bg-indigo-700 text-white shadow-md text-[1em] px-4 py-2 rounded-md relative inline-flex justify-center items-center whitespace-nowrap cursor-pointer no-underline leading-tight transition-all duration-200 hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  )
}
export default ProductForm
