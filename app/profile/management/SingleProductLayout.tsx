'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import FormSubmitBtn from '@/app/components/forms/FormSubmitBtn';
import gettingProductImages from './itemUploadComponents/gettingProductImages';
import gettingProductInfo from './itemUploadComponents/gettingProductInfo';
import Skeleton from '@mui/material/Skeleton';
import submitDiscount from './itemUploadComponents/submitDiscount';
import deleteWholeIndex from './itemUploadComponents/deleteWholeIndex';
import Input from '@/app/components/forms/Input';
import TextArea from '@/app/components/forms/TextArea';
import duplicateProducts from './comboUploadComponents/duplicateComboItem';
import updateProduct from './itemUploadComponents/updateProduct';
import setActiveStatus from './itemUploadComponents/setActiveStatus';

const SingleProductLayout = () => {
    const [items, setItems] = useState<{
        discount_amount: any;
        active_discount: any;
        image: any,
        name: string,
        description: string,
        priceAndSizes: { size: string, price: string }[],
        discount_price_size: { size: string, price: string }[]
    }[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [confirmChanges, setConfirmChanges] = useState<boolean>(false);
    const [showFullDescription, setShowFullDescription] = useState<boolean[]>([]);
    const [displayCount, setDisplayCount] = useState<number>(3);
    const dropdownRefs = useRef<Array<HTMLUListElement | null>>([]);
    const [remove, setRemove] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef<HTMLDivElement>(null);

    const discountRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState<any[]>([]);
    const [activeLoading, setActiveLoading] = useState<boolean>(false);
    const [applyingDiscount, setApplyingDiscount] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<{
        name: string,
        desc?: string,
        priceAndSizes: { size: string, price: string }[]
    } | null>(null);
    const [done, setDone] = useState<boolean>(false);
    const [doneMessage, setDoneMessage] = useState<any>("")

    const [itemNameErr, setItemNameErr] = useState<boolean>(false);
    const [itemNameErrMsg, setItemNameErrMsg] = useState<any>();
    const [itemDescErr, setItemDescErr] = useState<boolean>(false);
    const [itemDescErrMsg, setItemDescErrMsg] = useState<any>();
    const [itemSizeErr, setItemSizeErr] = useState<boolean>(false);
    const [itemSizeErrMsg, setItemSizeErrMsg] = useState<any>();
    const [itemPriceErr, setItemPriceErr] = useState<boolean>(false);
    const [itemPriceErrMsg, setItemPriceErrMsg] = useState<any>();


    const [discountSelected, setDiscountSelected] = useState(false);
    const [options, setOptions] = useState<boolean>(false);

    async function gettingImg(imgName: any, productName: any, fileDesc: string) {
        const image = await gettingProductImages(imgName);
        return {
            image: image,
            name: productName,
            description: fileDesc,
        };
    }

    const fetchData = useCallback(async () => {
        try {
            const productInfo = await gettingProductInfo();
            if (productInfo !== null) {
                const staticInfo = Array.from(productInfo);
                // Extracting price_size and discount_price_size from productInfo
                let priceAndSizes = staticInfo.map(prev => prev.price_size);
                let discountPriceAndSizes = staticInfo.map(prev => prev.discount_price_size);
                let discountAmounts = staticInfo.map(prev => prev.discount_amount); // Grabbing discount_amounts
                let activeDiscounts = staticInfo.map(prev => prev.active_discount); // Grabbing active_discounts
                let ogName = staticInfo.map(prev => prev.ogName);


                // Fetching images and combining with priceAndSizes
                const newItems = await Promise.all(staticInfo.map(info => gettingImg(info.ogName, info.product_name, info.desc)));

                const itemsWithPrices = newItems.map((item: any, index: any) => ({
                    ...item,
                    priceAndSizes: priceAndSizes[index],
                    discount_price_size: discountPriceAndSizes[index], // Include discount prices and sizes
                    active_discount: activeDiscounts[index], // Track active discount status
                    discount_amount: discountAmounts[index], // Include discount amounts
                }));

                // Setting items state
                setItems(itemsWithPrices);

                // Extracting active status and product names from productInfo
                const activeStatus = staticInfo.map(info => info.active);
                const productNames = staticInfo.map(info => info.product_name);

                // Combining activeStatus and productNames into an array of objects
                const combinedData = productNames.map((productName, index) => ({
                    product_name: productName,
                    active: activeStatus[index],
                    active_discount: activeDiscounts[index], // Track active discount status
                    discount_amount: discountAmounts[index], // Include discount amounts
                }));

                // Setting active state
                setActive(combinedData);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false); // Handle loading state in case of error
            console.error("Error fetching product data:", error);
        }
    }, []);



    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleDropdown = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const toggleOptions = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
        setOptions(true);
    };

    const toggleDescription = (index: number) => {
        setShowFullDescription(prev => {
            const newShowFullDescription = [...prev];
            newShowFullDescription[index] = !newShowFullDescription[index];
            return newShowFullDescription;
        });
    };

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current && e.target === modalRef.current) {
            setRemove(false);
            setActiveIndex(null);
        }
    };

    const closeCancleModal = (e: React.MouseEvent) => {
        if (cancelRef.current && e.target === cancelRef.current) {
            setRemovedIndex(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeIndex !== null && dropdownRefs.current[activeIndex] && event.target instanceof Node && !dropdownRefs.current[activeIndex]?.contains(event.target)) {
                setActiveIndex(null);
            }
        };
        if (activeIndex !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeIndex]);

    const [trackProductName, setTrackProductName] = useState("");
    const [trackProductSize, setTrackProductSize] = useState("");
    const [trackProductPrice, setTrackProductPrice] = useState("");
    const [trackProductDesc, setTrackProductDesc] = useState("");
    const [trackNewProductName, setTrackNewProductName] = useState<any>(trackProductName);
    const [trackNewProductDesc, setTrackNewProductDesc] = useState<any>(trackProductDesc);
    const setVars = (productName: string, productSize: string, productPrice: string, productDesc: string) => {
        setTrackProductName(productName);
        setTrackProductSize(productSize);
        setTrackProductPrice(productPrice);
        setTrackProductDesc(productDesc);
        setSelectedItem({
            name: productName,
            desc: productDesc,
            priceAndSizes: [{ size: productSize, price: productPrice }]
        });
        setRemove(true);
    };
    const handleShowMore = () => {
        setDisplayCount(items.length);
    };

    const handleShowLess = () => {
        setDisplayCount(3);
    };
    const isShowingAll = displayCount >= items.length;


    const toggleChecked = async (itemName: string, index: number) => {
        if (active && active[index]) {
            setActiveLoading(true);
            const duplicateActive = [...active];
            duplicateActive[index].active = !duplicateActive[index].active;
            setActiveStatus(itemName, duplicateActive[index].active)
            setActive(duplicateActive); // Update active state with modified duplicateActive
            setActiveLoading(false);
        }
    };
    const [discountUpdate, setDiscountUpdate] = useState<any[]>();
    const [discountPrice, setDiscountPrice] = useState<any[]>();
    const [discountFinalValue, setDiscountFinalValue] = useState<any>();
    const [selectedFinalItem, setSelectedFinalItem] = useState<any>();
    const [itemSizes, setItemSizes] = useState<any>("");
    const [itemPricesAndSizes, setItemPricesAndSizes] = useState<any[]>([]);

    const closeDiscountModal = (e: React.MouseEvent) => {
        if (discountRef.current && e.target === discountRef.current) {
            setApplyingDiscount(false);
            setDiscountSelected(false);
            setDiscountUpdate([]);
            setSelectedItem({ name: "", desc: "", priceAndSizes: [{ size: "", price: "" }] })
            setSelectedItem(null); // Clear selected item when closing modal
            setDiscountPrice([]);
            setDiscountFinalValue(null);
            setSelectedFinalItem(null)
        }
    };

    const closeOptionsModal = (e: React.MouseEvent) => {
        if (optionsRef.current && e.target === optionsRef.current) {
            setOptions(false);
            setTrackNewProductDesc("");
            setTrackNewProductName("");
            setItemPricesAndSizes([]);
        }
    };

    const discountCalculate = (discountValue: any, prices: any, selectedItem: any) => {
        let updatedValue;
        // Extracting prices and sizes separately
        const extractedPrices = prices.map((item: { id: any; price: any; size: any; }) => ({ id: item.id, price: item.price, size: item.size }));
        const discountedPrices = extractedPrices.map((item: { price: string; }) => {
            switch (discountValue) {
                case 0:
                    updatedValue = 0;
                    break;
                case 10:
                    updatedValue = 0.10;
                    break;
                case 15:
                    updatedValue = 0.15;
                    break;
                case 20:
                    updatedValue = 0.20;
                    break;
                case 25:
                    updatedValue = 0.25;
                    break;
                default:
                    updatedValue = 0;
                    break;
            }

            if (updatedValue === 0) {
                const originalPrice = parseFloat(item.price);
                const discountedPrice = originalPrice;
                item.price = discountedPrice.toFixed(2); // Update item's price with discounted value
                return item;
            } else {
                // Convert price to number and apply discount
                const originalPrice = parseFloat(item.price);
                const discountedPrice = originalPrice * (1 - updatedValue); // Calculate discounted price
                item.price = discountedPrice.toFixed(2); // Update item's price with discounted value
                return item;
            }
        });
        // Assuming setDiscountSelected and setDiscountUpdate are state setter functions
        setDiscountSelected(true);
        setDiscountUpdate(discountedPrices);
        setDiscountPrice(discountedPrices);
        setDiscountFinalValue(discountValue);
        setSelectedFinalItem(selectedItem)

    };



    const handleDiscountSubmit = () => {
        if (discountPrice) {
            submitDiscount(discountPrice, discountFinalValue, selectedFinalItem);
            setDone(true);
            setDoneMessage("Discount has successfully been applied! ");
            setTimeout(() => {
                window.location.reload();
            }, 700)
        }
    }
    const [removedIndex, setRemovedIndex] = useState<boolean>(false);

    const [availableSizes, setAvailableSizes] = useState<string[]>(['small', 'medium', 'large']);

    useEffect(() => {
        // Extract all sizes from itemPricesAndSizes
        const allSizes = itemPricesAndSizes.map(item => item.size);

        // Filter out sizes that are already in itemPricesAndSizes
        const uniqueAvailableSizes = availableSizes.filter(size => !allSizes.includes(size));

        // Update availableSizes state
        setAvailableSizes(uniqueAvailableSizes);
    }, [itemPricesAndSizes]);


    const handlePriceChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("index")
        console.log(index)
        const { value } = event.target;

        setItemPricesAndSizes(prevState => {
            const updatedItems = [...prevState];
            updatedItems[index] = { ...updatedItems[index], price: value };
            return updatedItems;
        });
    };

    const handleInputSizeChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        console.log("value");
        console.log(value);
        console.log("index");
        console.log(index);
        setItemPricesAndSizes(prevState => {
            const updatedItems = prevState.map((item, idx) => {
                if (idx === index) {
                    return { ...item, size: value };
                }
                return item;
            });
            return updatedItems;
        });
    };


    const handleAddSize = () => {
        if (itemPricesAndSizes.length < 3) {
            const newIndex = itemPricesAndSizes.length;
            const newSize = {
                id: newIndex + 1,
                price: '0.00',
                size: '',
            };
            setItemPricesAndSizes(prevState => [...prevState, newSize]);
        }
    };


    useEffect(() => {
        console.log(itemPricesAndSizes)
    }, [itemPricesAndSizes])


    const updateChanges = async (ogProductName: any, trackNewProductName: any, ogProductDesc: any, trackNewProductDesc: any, pricesAndSizes: any[]) => {
        try {
            let isValid = true;

            // Validate product name length
            if ((trackNewProductName.length > 0 && trackNewProductName.length < 3) || (trackNewProductName.length > 15)) {
                setItemNameErr(true);
                setItemNameErrMsg("Product name must be between 3 and 15 characters long");
                isValid = false;
                return;
            }

            // Check if product name already exists
            const isDuplicate = await duplicateProducts(trackNewProductName);
            if (isDuplicate) {
                setItemNameErr(true);
                setItemNameErrMsg("This product name already exists");
                isValid = false;
                return;
            }

            // Validate product description length
            if ((trackNewProductDesc.length > 0 && trackNewProductDesc.length < 100) || (trackNewProductDesc.length > 450)) {
                setItemDescErr(true);
                setItemDescErrMsg("Description must be between 100 and 450 characters");
                isValid = false;
                return;
            }

            // Validate prices and sizes
            pricesAndSizes.forEach((item, index) => {
                if (item.price === "") {
                    console.error(`Price at index ${index} is empty`);
                    isValid = false;
                }
            });

            // Check for duplicate sizes
            const sizeSet = new Set();
            let hasDuplicateSize = false;
            pricesAndSizes.forEach((item) => {
                if (sizeSet.has(item.size)) {
                    hasDuplicateSize = true;
                } else {
                    sizeSet.add(item.size);
                }
            });

            if (hasDuplicateSize) {
                setItemSizeErr(true);
                setItemSizeErrMsg("Cannot have two of the same sizes");
                isValid = false;
                return;
            }

            // Check for empty sizes
            pricesAndSizes.forEach((item, index) => {
                if (item.size === "") {
                    setItemSizeErr(true);
                    setItemSizeErrMsg("You cannot leave the size input empty");
                    isValid = false;
                    return;
                }

                if (item.price === "") {
                    setItemPriceErr(true);
                    setItemPriceErrMsg("Your price input field cannot be empty");
                    isValid = false;
                    return;
                }
            });

            if (isValid && !itemDescErr && !itemNameErr && !itemSizeErr && !itemPriceErr) {
                const finalProductName = trackNewProductName.length === 0 ? ogProductName : trackNewProductName;
                const finalProductDesc = trackNewProductDesc.length === 0 ? ogProductDesc : trackNewProductDesc;

                await updateProduct(ogProductName, finalProductName, ogProductDesc, finalProductDesc, pricesAndSizes);
                setDone(true);
                setDoneMessage("You've successfully updated the product's information.");
                setTimeout(() => {
                    window.location.reload();
                }, 700);
            }

        } catch (error) {
            console.error("Error in updateChanges:", error);
            throw error;
        }
    };


    // Function to handle product name change
    const productNameChange = (event: any) => {
        const value = event.target.value;
        setTrackNewProductName(value);

        // Validate and set error state if necessary
        if (value.length < 3 || value.length > 15) {
            setItemNameErr(true);
            setItemNameErrMsg("Product name must be between 3 and 15 characters long");
        } else {
            setItemNameErr(false);
            setItemNameErrMsg('');
        }
    };

    // Function to handle product description change
    const productDescChange = (event: any) => {
        const value = event.target.value;
        setTrackNewProductDesc(value);

        // Validate and set error state if necessary
        if (value.length < 100 || value.length > 450) {
            setItemDescErr(true);
            setItemDescErrMsg("Description must be between 100 and 450 characters");
        } else {
            setItemDescErr(false);
            setItemDescErrMsg('');
        }
    };


    const handleChangeClick = () => {
        setConfirmChanges(true);
        // Perform your update logic here
        updateChanges(trackProductName, trackNewProductName, trackProductDesc, trackNewProductDesc, itemPricesAndSizes)
            .then(() => {
                // After update is complete, reset confirmChanges to false
                setConfirmChanges(false);
            })
            .catch((error) => {
                // Handle errors if update fails
                console.error('Error updating changes:', error);
                setConfirmChanges(false);
            });
    };

    useEffect(() => {
        if (options || remove || applyingDiscount) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        // Clean up the effect
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [options, remove, applyingDiscount]);

    return (
        <>
            <h1 className='text-center text-custom-green italic text-[6rem]'>Products</h1>
            {
                applyingDiscount && selectedItem && (
                    <div
                        ref={discountRef}
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                        onClick={closeDiscountModal}
                    >
                        <div className="overflow-auto bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5">
                            <h2 className="text-xl font-bold mb-4">Discount Details for {selectedItem.name}</h2>
                            <center><h3 className="mb-4 font-semibold text-gray-900">Discount percentage</h3></center>
                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-license" type="radio" value="0" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(0, selectedItem.priceAndSizes, selectedItem.name)} />
                                        <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(0, selectedItem.priceAndSizes, selectedItem.name)}>0%</label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-id" type="radio" value="10" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(10, selectedItem.priceAndSizes, selectedItem.name)} />
                                        <label htmlFor="horizontal-list-radio-id" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(10, selectedItem.priceAndSizes, selectedItem.name)}>10%</label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-military" type="radio" value="15" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(15, selectedItem.priceAndSizes, selectedItem.name)} />
                                        <label htmlFor="horizontal-list-radio-military" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(15, selectedItem.priceAndSizes, selectedItem.name)}>15%</label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-passport" type="radio" value="20" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(20, selectedItem.priceAndSizes, selectedItem.name)} />
                                        <label htmlFor="horizontal-list-radio-passport" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(20, selectedItem.priceAndSizes, selectedItem.name)}>20%</label>
                                    </div>
                                </li>
                                <li className="w-full">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-custom" type="radio" value="25" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(25, selectedItem.priceAndSizes, selectedItem.name)} />
                                        <label htmlFor="horizontal-list-radio-custom" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(25, selectedItem.priceAndSizes, selectedItem.name)}>25%</label>
                                    </div>
                                </li>
                            </ul>

                            {/* Table to display sizes, original prices, and discounted prices */}
                            <div className="mt-4">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-200 divide-y divide-gray-200 overflow-y-auto">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left">Size</th>
                                            <th scope="col" className="px-6 py-3 text-left">Original Price</th>
                                            {discountSelected && <th scope="col" className="px-6 py-3 text-left">Discounted Price</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedItem.priceAndSizes.map((sizePrice, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 whitespace-nowrap">{sizePrice.size}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">${sizePrice.price}</td>
                                                {/* Display discounted price based on discount calculation */}
                                                {discountSelected && <td className="px-6 py-4 whitespace-nowrap">
                                                    {/* Add logic to display discounted price */}
                                                    {discountUpdate && discountUpdate[idx].price !== undefined ? `$${discountUpdate[idx].price}` : '-'}
                                                </td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4">

                                <center>
                                    <FormSubmitBtn onClick={() => handleDiscountSubmit()} pendingText='Making Changes...'>Confirm Discount</FormSubmitBtn>
                                </center>
                                {done && (
                                    <div
                                        className="fixed inset-0 bg-transparent bg-opacity-50 justify-center items-center z-60 flex"
                                    >
                                        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 z-50 translate-y-[18rem]" role="alert">
                                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                            </svg>
                                            <span className="sr-only">Info</span>
                                            <div>
                                                <span className="font-medium">Success</span>
                                                <p>{doneMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            {options && selectedItem && (
                <div
                    ref={optionsRef}
                    className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeOptionsModal}
                >
                    <div className="overflow-auto bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5 overflow-y-scroll max-h-[35rem]">
                        <h2 className="text-2xl sm:text-[1.75rem] font-bold mb-4">Settings for {selectedItem.name}</h2>
                        <h3 className="text-lg mt-4">Update product info</h3>
                        <div className='w-full'>
                            <Input divClass="py-4 w-full mt-0" typeInfo='new_name' type='text' name='Product Name' onChange={productNameChange} value={trackNewProductName < 1 ? trackProductName : trackNewProductName} className={itemNameErr ? 'ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 w-full' : "w-full"} />

                            {itemNameErr && <h1>{itemNameErrMsg}</h1>}
                            <TextArea divClass="w-full mt-0"
                                typeInfo='new_name'
                                type='text'
                                name='Product Description'
                                value={trackNewProductDesc.length < 1 ? trackProductDesc : trackNewProductDesc}
                                onChange={productDescChange}
                                className={itemDescErr ? 'min-h-36 max-h-60 block sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3 w-full' : "w-full min-h-36 max-h-60"}
                            />
                            {itemDescErrMsg && <h1>{itemDescErrMsg}</h1>}
                            <div className='gap-4'>
                                {itemPricesAndSizes.length >= 1 && itemPricesAndSizes.length <= 3 && (
                                    <div>
                                        <div>
                                            <div className='py-2'>
                                                <center>
                                                    {itemPricesAndSizes.length < 3 && (
                                                        <button
                                                            type="button"
                                                            onClick={handleAddSize}
                                                            className="bg-gray-500 text-white rounded px-2 md:px-3 py-1 mt-2"
                                                        >
                                                            Add Size
                                                        </button>
                                                    )}
                                                </center>
                                            </div>
                                            {itemPricesAndSizes.map((item, index) => (
                                                <div key={index} className="block md:flex items-center mb-2 md:gap-4">
                                                    <div className='w-full md:w-1/4 my-1'>
                                                        <label htmlFor="price" className="block text-sm font-medium leading-6 text-custom-green">Price</label>
                                                        <div className="relative mt-0 rounded-md shadow-sm">
                                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                                <span className="text-gray-500 text-sm">$</span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                name="comboPrice"
                                                                id="price"
                                                                placeholder={"1.00"}
                                                                value={item.price}
                                                                // onBlur={handleNumBlur(index)}
                                                                onChange={(e) => handlePriceChange(index, e)}
                                                                className={itemPriceErr ? 'rounded-md block w-full border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-red-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-6 outline-red-600 h-10 text-[1rem]' : "rounded-md block w-full border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-custom-green placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-custom-green text-sm leading-6 outline-custom-green h-10 text-[1rem]"}
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                                <label htmlFor="currency" className="sr-only">Currency</label>
                                                            </div>
                                                        </div>
                                                        {itemPriceErr ? <p className='text-left text-red-600'>{itemPriceErrMsg}</p> : ""}
                                                    </div>
                                                    <div className='w-full md:w-3/4 -my-1'>
                                                        <label htmlFor="sizes" className="block text-sm font-medium leading-6 text-custom-green">Select a size</label>
                                                        <select
                                                            id="sizes"
                                                            className={itemSizeErr ? "text-[1rem] bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 outline-red-600 border-red-600" : "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-custom-green focus:border-custom-green block w-full p-2.5 outline-custom-green border-custom-green text-[1rem]"}
                                                            onChange={(e) => handleInputSizeChange(index, e)}
                                                            value={item.size}
                                                        >
                                                            <option value="">Choose a size</option>
                                                            <option value="small">Small</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="large">Large</option>
                                                        </select>
                                                        {itemSizeErr && <h1 className='text-red-600'>{itemSizeErrMsg}</h1>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className='pt-4'>
                                    <center>
                                        <FormSubmitBtn
                                            className='w-full'
                                            onClick={() => {
                                                handleChangeClick();
                                            }
                                            }>
                                            {!confirmChanges && (<h1>Confirm Changes</h1>)}
                                            {confirmChanges && (<h1>Confirming Changes...</h1>)}
                                        </FormSubmitBtn>
                                    </center>
                                </div>

                            </div>
                        </div>

                        {/* </button> */}
                        <h3 className="text-lg mt-8 mb-2">Delete Product</h3>
                        <button
                            onClick={() => {
                                setOptions(false);
                                setTrackProductName(selectedItem.name);
                                setRemovedIndex(true);
                            }}
                            className="text-red-600 hover:underline focus:outline-none text-[1rem]"
                        >
                            Delete "{selectedItem.name}"
                        </button>
                        {done && (
                            <div
                                className="fixed inset-0 bg-transparent bg-opacity-50 justify-center items-center z-60 flex pt-[10rem]"
                            >
                                <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 z-50 translate-y-[18rem]" role="alert">
                                    <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span className="sr-only">Info</span>
                                    <div>
                                        <span className="font-medium">Success</span>
                                        <p>{doneMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div >
                </div >
            )}

            {removedIndex && (
                <div
                    ref={cancelRef}
                    className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setRemovedIndex(false)}
                >
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Remove product</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Are you sure you want to remove this product? It will be deleted forever.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={async () => {
                                console.log(1);
                                await deleteWholeIndex(trackProductName);
                                console.log(2);
                                setDoneMessage("Successfully deleted product! ");
                                setDone(true);
                                console.log(3);
                            }}>Remove</button>
                            <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => {
                                setRemovedIndex(false);
                                setOptions(true);
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-start p-4 bg-white shadow rounded-lg">
                            {/* Image Skeleton */}
                            <Skeleton variant="rectangular" className="w-[25rem] h-48 mr-4" />

                            {/* Content Skeleton */}
                            <div className="flex-1">
                                <Skeleton variant="text" width="60%" height={30} className="mb-2" />
                                <Skeleton variant="text" width="40%" height={24} className="mb-4" />
                                <Skeleton variant="text" width="80%" height={20} className="mb-4" />

                                <div className="flex space-x-4 mt-4">
                                    <Skeleton variant="rectangular" width={50} height={36} />
                                    <Skeleton variant="rectangular" width={50} height={36} />
                                    <Skeleton variant="rectangular" width={50} height={36} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full p-4 mx-auto border-none outline-none">
                    {items.slice(0, displayCount).map((item, index) => (
                        <div key={`${item.name}-${index}`} className='p-4 bg-gray-100 rounded-lg shadow-md mb-4 w-full'>
                            <div className='md:flex md:items-start'>
                                <div className='w-full md:w-1/2'>
                                    <img
                                        src={item.image || '/default-image.png'}
                                        alt={item.name}
                                        className='object-cover w-full h-64 rounded-lg'
                                    />
                                </div>
                                <div className='w-full md:w-1/2 p-4'>
                                    <h2 className='text-xl font-bold mt-2'>{item.name}</h2>
                                    <p className={`text-gray-600 ${showFullDescription[index] ? '' : 'truncate'}`}>{item.description}</p>

                                    <div className='flex items-center justify-between mt-4'>
                                        <button
                                            onClick={() => toggleDescription(index)}
                                            className='text-green-600 underline hover:text-green-500 focus:outline-none'
                                        >
                                            {showFullDescription[index] ? 'Show Less' : 'Show More'}
                                        </button>
                                        <label className='flex items-center space-x-2'>
                                            <span>Activate:</span>
                                            <input
                                                type="checkbox"
                                                checked={active[index]?.active}
                                                onChange={() => toggleChecked(item.name, index)}
                                                className='form-checkbox'
                                            />
                                        </label>
                                    </div>

                                    <div className='mt-4 w-full flex justify-center gap-5'>
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className='bg-custom-green text-white py-2 px-4 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-custom-green'
                                        >
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
                                                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setApplyingDiscount(true);
                                            }}
                                            className='bg-custom-green text-white py-2 px-4 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-custom-green'
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                shapeRendering="geometricPrecision"
                                                textRendering="geometricPrecision"
                                                imageRendering="optimizeQuality"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                viewBox="0 0 439 512.51"
                                                className="w-6 h-6"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="nonzero"
                                                    d="M0 111.57c0-29.52 8.91-56.91 28.98-78.93l.03.03C38.74 21.93 49.78 13.8 62.13 8.32c25.01-11.1 55.83-11.11 80.82.07 12.38 5.54 23.43 13.77 33.11 24.67 20.04 22.5 28.51 50.29 28.51 80.1v22.34c0 29.1-8.85 56.15-28.3 78.09l-.07.06c-19.29 21.6-44.16 32.75-73.12 32.75-28.95 0-54.29-10.9-73.93-32.21v-.07C8.52 191.6 0 163.77 0 133.59v-22.02zm53.22 24.03c0 8.88 1.22 16.92 3.63 24.04 4.28 12.62 13.19 24.65 25.61 30.15 5.89 2.61 12.76 3.92 20.62 3.92 7.39 0 13.9-1.26 19.49-3.76 12.4-5.63 20.98-17.5 25.12-30.2 2.43-7.48 3.66-16.06 3.66-25.74v-22.54c0-9.37-1.21-17.68-3.63-24.91-4.19-12.53-13.2-24.58-25.48-30.06-11.38-5.06-27.91-5.08-39.29 0-12.71 5.67-21.63 17.59-25.9 30.58-2.55 7.71-3.83 16.59-3.83 26.61v21.91zm181.21 241.62c0-15.29 2.36-29.54 7.1-42.73 9.33-25.91 29.32-49.04 54.72-60.23 24.86-10.95 55.82-10.9 80.69 0 25.96 11.38 45.7 34.37 54.98 60.93 4.71 13.46 7.08 28.2 7.08 44.15v22.02c0 15.28-2.39 29.54-7.14 42.71-9.38 25.99-29.23 48.98-54.69 60.25-24.79 10.98-55.46 10.86-80.29.01-25.82-11.27-45.92-34.13-55.33-60.52-4.76-13.35-7.12-28.01-7.12-43.94v-22.65zm53.22 24.24c0 9.26 1.21 17.5 3.62 24.68 4.24 12.65 13.02 24.36 25.46 29.81 11.6 5.08 28.85 5.21 40.44.03 12.33-5.52 20.91-17.71 24.96-30.26 2.42-7.49 3.64-16.12 3.64-25.85v-22.75c0-9.87-1.22-18.53-3.64-25.94-4.12-12.63-12.34-23.4-24.8-28.63v-.07c-11.78-4.96-29.47-4.98-41.22.08-12.46 5.36-20.8 16.68-24.85 29.35-2.4 7.52-3.61 16.35-3.61 26.48v23.07zM103.24 456.2l-27.98-19.44L314.88 53.1l43.57 30.26-239.62 383.66-15.59-10.82z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                try {
                                                    setItemPricesAndSizes(item.priceAndSizes);
                                                    setTrackProductDesc(item.description);
                                                    setTrackProductName(item.name);
                                                    setSelectedItem(item); // Set selected item for discount modal
                                                    setOptions(true);
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }}
                                            className='bg-custom-green text-white py-2 px-4 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-custom-green'
                                        >
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
                                                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <ul ref={el => (dropdownRefs.current[index] = el)} className={`mt-4 ${activeIndex === index ? 'block' : 'hidden'}`}>
                                        {(item.active_discount ? item.discount_price_size : item.priceAndSizes).map((sizePrice, idx) => (
                                            <li key={idx} className='flex justify-between items-center py-2 px-4 bg-gray-200 rounded-md mb-2'>
                                                <span>{sizePrice.size}</span>
                                                <span>${sizePrice.price}</span>
                                                {item.active_discount && <span>({item.discount_amount}%)</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div >
            )}

            <center className='w-3/4 sm:w-full'>
                {/* <FormSubmitBtn
                    className='bg-custom-yellow h-[3rem] pt-[.6rem] hover:bg-custom-yellow w-full xl:w-3/4'
                    pendingText='Creating your template...'
                    onClick={handleStep}
                >
                    New Item
                </FormSubmitBtn> */}
            </center>
            <div className="flex justify-center mt-4">
                {isShowingAll ? (
                    <FormSubmitBtn
                        className='h-[3rem] pt-[.6rem] hover:bg-custom-dark-green w-full xl:w-3/4'
                        pendingText='Creating your template...'
                        onClick={handleShowLess}
                    >
                        Show Less
                    </FormSubmitBtn>
                ) : (
                    <FormSubmitBtn
                        className='h-[3rem] pt-[.6rem] hover:bg-custom-dark-green w-full xl:w-3/4'
                        pendingText='Creating your template...'
                        onClick={handleShowMore}
                    >
                        Show More
                    </FormSubmitBtn>
                )}
            </div>
        </>
    );
};


export default SingleProductLayout;
