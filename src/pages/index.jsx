import Head from "next/head";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Container,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { DarkMode } from "./DarkMode";
import { useFormik } from "formik";
import {
  useCreateProduct,
  useDeleteProduct,
  useEditProduct,
  useFetchProducts,
} from "@/features/product";

import * as yup from "yup";

export default function Home() {
  // swet alert
  const MySwal = withReactContent(Swal);

  //  toast file
  const toast = useToast();

  const {
    data,
    isLoading: productsIsLoading,
    refetch: refetchProducts,
  } = useFetchProducts({
    onError: () => {
      toast({
        title: "Ada Kesalahan Terjadi",
        status: "error",
      });
    },
  });

  // form logic
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      image: "",
      id: "",
    },
    onSubmit: () => {
      const { name, price, description, image, id } = formik.values;

      if (id) {
        // melakukan PATCH / products/{id}
        editProduct({
          name,
          price: parseInt(price),
          description,
          image,
          id,
        });

        formik.setFieldValue("name", "");
        formik.setFieldValue("price", "");
        formik.setFieldValue("description", "");
        formik.setFieldValue("image", "");
        formik.setFieldValue("id", "");
        toast({
          title: "Product Edit",
          status: "warning",
        });
      } else {
        createProduct({
          name,
          price: parseInt(price),
          description,
          image,
        });
        formik.setFieldValue("name", "");
        formik.setFieldValue("price", "");
        formik.setFieldValue("description", "");
        formik.setFieldValue("image", "");
        formik.setFieldValue("id", "");

        toast({
          title: "Product added",
          status: "success",
        });
      }
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("name tidak boleh kosong"),
      price: yup.number().required("price tidak boleh kosong"),
      description: yup.string().required("description tidak boleh kosong"),
      image: yup.string().required("image tidak boleh kosong"),
    }),
  });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  // create product
  const { mutate: createProduct, isLoading: createProductsIsLoading } =
    useCreateProduct({
      onSuccess: () => {
        refetchProducts();
      },
    });

  // delete product
  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const confirmationDelete = (productId) => {
    // const shouldDelete = confirm("are you sure?");
    return MySwal.fire({
      title: "Are you sure delete?",
      text: "If your delete don't back data",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productId);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  // edit product
  const onEditClick = (product) => {
    formik.setFieldValue("id", product.id);
    formik.setFieldValue("name", product.name);
    formik.setFieldValue("price", product.price);
    formik.setFieldValue("description", product.description);
    formik.setFieldValue("image", product.image);
  };

  const { mutate: editProduct, isLoading: editProductIsLoading } =
    useEditProduct({
      onSuccess: () => {
        refetchProducts();
      },
    });

  //  render product
  const renderProducts = () => {
    return data?.data.map((product) => {
      return (
        <Tr key={product.id}>
          <Td>{product.id}</Td>
          <Td>
            <Button
              onClick={() => onEditClick(product)}
              colorScheme="cyan"
              size="sm"
            >
              Edit {product.id}
            </Button>
          </Td>
          <Td>
            <Button
              onClick={() => confirmationDelete(product.id)}
              colorScheme="red"
              size="sm"
            >
              Delete {product.id}
            </Button>
          </Td>
          <Td>{product.name}</Td>
          <Td>
            {product.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </Td>
          <Td>{product.description}</Td>
          <Td>{product.image}</Td>
        </Tr>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          {DarkMode()}
          <Heading>Hello World</Heading>
          <Table mb={5}>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th colSpan={2}>Action</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th>Image</Th>
              </Tr>
            </Thead>
            <Tbody>{renderProducts()}</Tbody>
          </Table>
          {productsIsLoading ? <Spinner /> : null}

          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={3} mb={5}>
              <FormControl>
                <FormLabel>Product Id</FormLabel>
                <Input
                  name="id"
                  value={formik.values.id}
                  onChange={handleFormInput}
                disabled />
              </FormControl>
              <FormControl isInvalid={formik.errors.name}>
                <FormLabel>Product Name</FormLabel>
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={handleFormInput}
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.price}>
                <FormLabel>Price</FormLabel>
                <Input
                  name="price"
                  value={formik.values.price}
                  onChange={handleFormInput}
                />
                <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.description}>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={formik.values.description}
                  onChange={handleFormInput}
                />
                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.image}>
                <FormLabel>Image</FormLabel>
                <Input
                  name="image"
                  value={formik.values.image}
                  onChange={handleFormInput}
                />
                <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
              </FormControl>
              {createProductsIsLoading || editProductIsLoading ? (
                <Spinner />
              ) : (
                <Button type="submit">Submit Product</Button>
              )}
            </VStack>
          </form>
        </Container>
      </main>
    </>
  );
}
