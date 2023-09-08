import Layout from '@/components/Layout'
import ProductForm from '@/components/ProductForm'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null)
  const router = useRouter()
  const {productId }= router.query

  useEffect(() => {
    if (!productId) return

    axios.get('/api/products?productId=' + productId).then((res) => {
      setProductInfo(res.data)
    })
  }, [productId])

  return (
    <Layout>
      <legend className="mb-3 text-contrast-higher text-lg">
        Edit Product
      </legend>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  )
}
export default EditProductPage
