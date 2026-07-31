import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CusMenuNav from "../components/CusMenuNav";
import CusDishCard from "../components/CusDishCard";
import { CustomerContext } from "../context/CustomerContext";
import { socket } from "../src/socket";

const CustMenu = () => {
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);

    const {
        url,
        hotel, // hotel should be available in CustomerContext
    } = useContext(CustomerContext);

    const [selcat, setselcat] = useState("");
    const [searcher, setsearcher] = useState("");
    const [food, setfood] = useState("");

    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${url}/api/customer/menu`, {
                withCredentials: true,
            });

            setDishes(res.data.dishes);
            setCategories(res.data.categories);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // ---------------- SOCKET CONNECTION ----------------

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Socket Connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Socket Disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    // ---------------- JOIN HOTEL ROOM ----------------

    useEffect(() => {
        if (!hotel?._id) return;

        socket.emit("joinHotel", hotel._id);

        console.log("Joined Hotel Room:", hotel._id);
    }, [hotel]);

    // ---------------- LISTEN FOR AVAILABILITY ----------------

    useEffect(() => {
        const handleAvailability = (data) => {
            console.log("Received:", data);

            setDishes((prev) =>
                prev.map((dish) =>
                    dish._id === data.dishId
                        ? {
                              ...dish,
                              isAvailable: data.isAvailable,
                          }
                        : dish
                )
            );
        };

        socket.on("dishAvailabilityChanged", handleAvailability);

        return () => {
            socket.off("dishAvailabilityChanged", handleAvailability);
        };
    }, []);

    // ---------------- FILTER ----------------

    const filteredDishes = dishes.filter((dish) => {
        const categoryMatch =
            selcat === "" || dish.categoryId === selcat;

        const searchMatch = dish.dishName
            .toLowerCase()
            .includes(searcher.toLowerCase());

        const foodMatch =
            food === "" || dish.foodType === food;

        return categoryMatch && searchMatch && foodMatch;
    });

    return (
        <div>
            <CusMenuNav
                categories={categories}
                setselcat={setselcat}
                setsearcher={setsearcher}
                setfood={setfood}
            />

            <div className="mt-6 flex flex-col gap-2">
                {filteredDishes.length > 0 ? (
                    filteredDishes.map((dish) => (
                        <CusDishCard
                            key={dish._id}
                            dish={dish}
                        />
                    ))
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm ring-1 ring-black/5">
                        <h2 className="text-lg font-semibold text-gray-700">
                            No dishes found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Add a new dish or change the selected category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustMenu;