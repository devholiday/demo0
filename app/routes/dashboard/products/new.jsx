import { useForm } from "react-hook-form";
import { getFirestore, collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

export default function NewProduct() {
    const navigate = useNavigate();
    const storage = getStorage();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async data => {
        try {
            console.log(data)
            const db = getFirestore();

            let {title, price, image=[]} = data;

            price = Number(price);
          
            const docRef = await addDoc(collection(db, "products"), {title, price});
            const productId = docRef.id;

            console.log("Document written with ID: ", productId);

            if (image.length > 0) {
                const file = image[0];

                const storageRef = ref(storage, 'images/' + productId + '/' + file.name);
                uploadBytes(storageRef, file).then(async (snapshot) => {
                    console.log('Uploaded a blob or file!');
    
                    const productRef = doc(db, "products", productId);
                    await updateDoc(productRef, {
                        image: file.name
                      });

                      navigate('/dashboard/products');
                });
            } else {
                navigate('/dashboard/products');
            }
          } catch (e) {
            console.log(e);
            console.error("Error adding document: ", e);
          }
    };

    return (
        <>
            <h1>New product</h1>

            <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <input {...register("image")}  type="file" name="image" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input {...register("title", { required: true })} className="form-control" />
                    {errors.title && (
                        <div className="form-text">This field is required</div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input {...register("price")} className="form-control" />
                </div>
                <input type="submit" className="btn btn-primary" value="Add" />
                </form>
            </div>
        </>
    )
}