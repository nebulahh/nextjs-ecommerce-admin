import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

function DeleteProductPage() {
  const router = useRouter()
  const [productInfo, setProductInfo] = useState()
  const { productId } = router.query

  useEffect(() => {
    if (!productId) {
      return
    }
    axios.get('/api/products?id=' + productId).then((response) => {
      setProductInfo(response.data)
    })
  }, [productId])

  function goBack() {
    router.push('/products')
  }
  async function deleteProduct() {
    await axios.delete('/api/products?id=' + productId)
    goBack()
  }
  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete &nbsp;&quot;{productInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  )
}
export default DeleteProductPage
