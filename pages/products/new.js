
import Layout from '@/components/Layout'
import ProductForm from '@/components/ProductForm'

function NewProduct() {
  return (
    <Layout>
      <legend className="mb-3 text-contrast-higher text-lg">
          Add new Product
        </legend>

      <ProductForm />
    </Layout>
  )
}
export default NewProduct
