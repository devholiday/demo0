import { useParams } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
import { useEffect } from "react";

export default function EditProduct() {
    const params = useParams();

    const {productId} = params;
    
    const db = getFirestore();
    const storage = getStorage();
    
    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "products", productId);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const url = docSnap.data().imag ? await getDownloadURL(ref(storage, 'images/' + productId + '/' + docSnap.data().image)) : null;
                const {title, price} = docSnap.data();
                reset({title, price, url});
            } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            }
        };

        fetchProduct();
    }, []);

   
    const onSubmit = async data => {
        try {
            const db = getFirestore();

            let {title, price, image=[]} = data;

            price = Number(price);

            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, {title, price});

            if (image.length > 0) {
                const file = image[0];

                const storageRef = ref(storage, 'images/' + productId + '/' + file.name);
                uploadBytes(storageRef, file).then(async (snapshot) => {
                    console.log('Uploaded a blob or file!');
    
                    const productRef = doc(db, "products", productId);
                    await updateDoc(productRef, {
                        image: file.name
                      });
                });
            }
          } catch (e) {
            console.log(e);
            console.error("Error adding document: ", e);
          }
    };

    const deleteProduct = async () => {
        await deleteDoc(doc(db, "products", productId));
    };

    return (
        <>
            <h1>Edit product</h1>

            <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    {getValues('url') && <img src={getValues('url')} className="card-img-top" style={{width: '150px'}} />}
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
                <input type="submit" className="btn btn-primary" value="Edit" />
                </form>

                <div>
                    <button onClick={() => deleteProduct()}>Delete</button>
                </div>
            </div>
        </>
    )
}