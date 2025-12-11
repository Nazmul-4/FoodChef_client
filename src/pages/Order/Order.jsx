import { useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth'; // Or useContext(AuthContext)
import useAxiosSecure from '../../hooks/useAxiosSecure'; // ✅ IMPORT THIS
import axios from 'axios';
const Order = () => {
    const meal = useLoaderData();
    const { user } = useAuth();
    const { register, handleSubmit, watch } = useForm();
    const axiosSecure = useAxiosSecure(); // ✅ USE THIS (Not axiosPublic)
    const navigate = useNavigate();

    // Calculate Price dynamically
    const quantity = watch('quantity', 1);
    const totalPrice = meal.price * quantity;

const onSubmit = async (data) => {
        // 1. Manually grab the token from storage
        const token = localStorage.getItem('access-token');

        // Check if token exists before sending
        if (!token) {
            Swal.fire('Error', 'You are not logged in. Please login again.', 'error');
            return;
        }

        const orderData = {
            foodId: meal._id,
            mealName: meal.name, 
            price: meal.price,
            quantity: parseInt(data.quantity),
            totalPrice: totalPrice,
            chefId: meal.chefId || "unknown",
            chefEmail: meal.chefEmail,
            userEmail: user?.email,
            userName: user?.displayName,
            userAddress: data.userAddress,
            orderStatus: "pending",
            paymentStatus: "Pending",
            orderTime: new Date()
        };

        try {
            // 2. Send request using normal axios, but FORCE the header
            // Note: Use the base URL directly here to be safe
            const res = await axios.post('https://food-chef-server-three.vercel.app/orders', orderData, {
                headers: {
                    'Authorization': `Bearer ${token}` // <--- FORCING THE TOKEN HERE
                }
            });
            
            if (res.data.insertedId) {
                Swal.fire('Success!', 'Order placed successfully!', 'success');
                navigate('/dashboard/my-orders');
            }
        } catch (error) {
            console.error("Order Error:", error);
            // Show the exact error from the server if possible
            Swal.fire('Error', error.response?.data?.message || 'Order failed', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-10">
            <h2 className="text-3xl font-bold text-center mb-8">Confirm Your Order</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label">Meal Name</label>
                        <input type="text" defaultValue={meal.name} readOnly className="input input-bordered bg-gray-100" />
                    </div>
                    <div className="form-control">
                        <label className="label">Price (Per Unit)</label>
                        <input type="text" defaultValue={meal.price} readOnly className="input input-bordered bg-gray-100" />
                    </div>
                    <div className="form-control">
                        <label className="label">Your Email</label>
                        <input type="email" defaultValue={user?.email} readOnly className="input input-bordered bg-gray-100" />
                    </div>
                    <div className="form-control">
                        <label className="label">Total Price</label>
                        <input type="text" value={`$${totalPrice}`} readOnly className="input input-bordered bg-gray-100 font-bold" />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">Quantity</label>
                    <input 
                        type="number" 
                        defaultValue={1} 
                        min="1"
                        {...register("quantity", { required: true, min: 1 })} 
                        className="input input-bordered" 
                    />
                </div>

                <div className="form-control">
                    <label className="label">Delivery Address</label>
                    <textarea 
                        {...register("userAddress", { required: true })} 
                        placeholder="Enter your full delivery address" 
                        className="textarea textarea-bordered h-24"
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full text-white">Confirm Order</button>
            </form>
        </div>
    );
};

export default Order;