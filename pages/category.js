import Layout from '@/components/Layout'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2'

function Category({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null)
  const [name, setName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [properties, setProperties] = useState([])
  const { data: session } = useSession()

  useEffect(() => {
    fetchCategories()
  }, [])

  function fetchCategories() {
    try {
      axios.get('/api/category').then((res) => {
        setCategories(res.data)
      })
    } catch (e) {
      throw new Error(e)
    }
  }

  async function saveCategory(e) {
    try {
      e.preventDefault()

      const data = {
        name,
        parentCategory,
        properties: properties.map((property) => ({
          name: property.name,
          values: property.values.split(','),
        })),
        createdBy: session?.user._id
      }

      if (editedCategory) {
        data._id = editedCategory._id
        await axios.put('/api/category', data)
        setEditedCategory(null)
      } else {
        await axios.post('/api/category', data)
      }
      setName('')
      setParentCategory('')
      setProperties([])
      setCreator('')
      fetchCategories()
    } catch (error) {
      return error
    }
  }

  function editCategory(category) {
    setEditedCategory(category)
    setName(category.name)
    setParentCategory(category.parent?._id)
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    )
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category
          await axios.delete('/api/category?_id=' + _id)
          fetchCategories()
        }
      })
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }]
    })
  }
  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].name = newName
      return properties
    })
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].values = newValues
      return properties
    })
  }
  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove
      })
    })
  }

  if (session?.isAdmin === true) {
    return (
      <Layout>
        <h1>Categories</h1>
        <label>
          {editedCategory
            ? `Edit category: ${editedCategory.name}`
            : 'Create new category'}
        </label>
        <form onSubmit={saveCategory}>
          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder={'Category name'}
            />

            <select
              onChange={(e) => setParentCategory(e.target.value)}
              value={parentCategory}
            >
              <option value="">No parent category</option>

              {categories.length > 0 &&
                categories.map((category, i) => (
                  <option key={i} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block">Properties</label>
            <button
              onClick={addProperty}
              type="button"
              className="btn-default text-sm mb-2"
            >
              Add new property
            </button>
            {properties.length > 0 &&
              properties.map((property, index) => (
                <div key={index} className="flex gap-1 mb-2">
                  <input
                    type="text"
                    value={property.name}
                    className="mb-0"
                    onChange={(ev) =>
                      handlePropertyNameChange(index, property, ev.target.value)
                    }
                    placeholder="property name (example: color)"
                  />
                  <input
                    type="text"
                    className="mb-0"
                    onChange={(ev) =>
                      handlePropertyValuesChange(
                        index,
                        property,
                        ev.target.value
                      )
                    }
                    value={property.values}
                    placeholder="values, comma separated"
                  />
                  <button
                    onClick={() => removeProperty(index)}
                    type="button"
                    className="btn-red"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>

          <div className="flex gap-2">
            {editedCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditedCategory(null)
                  setName('')
                  setParentCategory('')
                  setProperties([])
                }}
                className="btn-default"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary py-1">
              Save
            </button>
          </div>
        </form>

        {!editedCategory && (
          <table className="basic mt-4">
            <thead>
              <tr>
                <td>Category name</td>
                <td>Parent category</td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map((category, i) => (
                  <tr key={i}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td>
                      <button
                        onClick={() => editCategory(category)}
                        className="btn-default mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="btn-red"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </Layout>
    )
  } else {
    return null
}
}

export default withSwal(({ swal }, ref) => <Category swal={swal} />)
