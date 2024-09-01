'use client';
import React, { useEffect, useState, useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';
import defaultPfp from "../../deafult-pfp.jpeg";
import getComboImg from './comboUploadComponents/getComboImg';
import getComboInfo from './comboUploadComponents/getComboInfo';
import deleteComboItem from './comboUploadComponents/deleteComboItem';
import FormSubmitBtn from '@/app/components/forms/FormSubmitBtn';
import setActiveCombo from './comboUploadComponents/setActiveCombo';
import submitComboDiscount from './comboUploadComponents/submitComboDiscount';
import Input from '@/app/components/forms/Input';
import TextArea from '@/app/components/forms/TextArea';
import { MultiSelect } from 'react-multi-select-component';
import getProductNames from './comboUploadComponents/getProductNames';
import deleteCombo from './comboUploadComponents/deleteCombo';
import updateComboInfo from './comboUploadComponents/updateComboInfo';

interface ComboItem {
    value: string;
    label: string;
}

interface ComboInfo {
    image: any;
    ogName: string;
    name: string;
    price: string;
    combo_items: ComboItem[];
    active?: boolean; // Add active field to ComboInfo interface
    active_discount?: boolean;
    active_discount_price?: any;
    discount_amount?: any;
    desc?: any;

}

const ComboProductLayout = () => {
    const [items, setItems] = useState<ComboInfo[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [displayCount, setDisplayCount] = useState<number>(3); // State to manage number of items to display
    const dropdownRefs = useRef<Array<HTMLUListElement | null>>([]);
    const [loading, setLoading] = useState(true);
    const [activeLoading, setActiveLoading] = useState<boolean>(false);
    const [active, setActive] = useState<any[]>([]);
    const [applyingDiscount, setApplyingDiscount] = useState<boolean>(false);
    const discountRef = useRef<HTMLDivElement>(null);
    const [discountedCheck, setDiscountedCheck] = useState<boolean | null>(null);
    const [discountedCheckReturn, setDiscountedCheckReturn] = useState<any>(null);
    const [discountPercentage, setDiscountPercentage] = useState<any>(null);
    const [discountedItemName, setDiscountedItemName] = useState<any>(null);
    const [done, setDone] = useState<boolean>(false);
    const [doneMessage, setDoneMessage] = useState<any>("")
    const [options, setOptions] = useState<boolean>(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    const [trackNewComboDesc, setTrackNewComboDesc] = useState<string>("");
    const [trackNewComboName, setTrackNewComboName] = useState<string>("");
    const [trackNewComboItems, setTrackNewComboItems] = useState<any[]>([]);

    const [trackComboDesc, setTrackComboDesc] = useState<any>("");
    const [trackComboName, setTrackComboName] = useState<any>("");
    const [trackComboItems, setTrackComboItems] = useState<any[]>([]);

    const [comboNameErr, setComboNameErr] = useState<boolean>(false);
    const [comboNameErrMsg, setComboNameErrMsg] = useState<any>("");

    const [comboDescErr, setComboDescErr] = useState<boolean>(false);
    const [comboDescErrMsg, setComboDescErrMsg] = useState<any>("");

    const [comboItemErr, setComboItemErr] = useState<boolean>(false);
    const [comboItemErrMsg, setComboItemErrMsg] = useState<any>("");

    const [allProducts, setAllProducts] = useState<{ value: string, label: string }[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productInfo = await getProductNames(); // Replace with your actual API call
                const mappedProducts: { value: string, label: string, ogValue: string }[] = [];
                if (productInfo) {
                    productInfo.forEach(product => {
                        product.price_size.forEach((size: any) => {
                            mappedProducts.push({
                                // value: `${product.product_name}-${size.size}-${size.price}`,
                                // label: `${product.product_name} - ${size.size} - ${size.price}`,
                                value: `${product.product_name}-${size.size}`,
                                label: `${product.product_name} - ${size.size}`,
                                ogValue: `${product.product_name}`
                            });
                        });
                    });
                }

                setAllProducts(mappedProducts);
                console.log(mappedProducts); // Log the mapped products with sizes and prices
            } catch (error) {
                console.error("Error fetching product info:", error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        dropdownRefs.current = Array(items.length).fill(null).map((_, index) => dropdownRefs.current[index] || null);
    }, [items.length]);

    async function gettingImg(fileName: string, fileDesc: string) {
        const image = await getComboImg(fileName);
        return {
            image: image?.publicUrl,
            name: fileName,
        };
    }

    const handleNewComboName = (event: any) => {
        const value = event.target.value;
        setTrackNewComboName(value);

        // Validate and set error state if necessary
        if (value.length < 3 || value.length > 15) {
            setComboNameErr(true);
            setComboNameErrMsg("Combo name must be between 3 and 15 characters long");
        } else {
            setComboNameErr(false);
            setComboNameErrMsg('');
        }
    };

    const handleNewComboDesc = (event: any) => {
        const value = event.target.value;
        setTrackNewComboDesc(value);

        // Validate and set error state if necessary
        if (value.length < 100 || value.length > 450) {
            setComboDescErr(true);
            setComboDescErrMsg("Description must be between 100 and 450 characters");
        } else {
            setComboDescErr(false);
            setComboDescErrMsg('');
        }
    };

    const closeOptionsModal = (e: React.MouseEvent) => {
        if (optionsRef.current && e.target === optionsRef.current) {
            setOptions(false);
            document.body.classList.remove('overflow-hidden'); // Remove class to enable scrolling
            setTrackNewComboDesc("");
            setTrackNewComboName("");
            setTrackNewComboItems([]);
        }
    };

    const toggleChecked = async (itemName: string, index: number) => {
        if (active && active[index]) {
            setActiveLoading(true);
            const duplicateActive = [...active];
            duplicateActive[index].active = !duplicateActive[index].active;
            setActive(duplicateActive); // Update active state with modified duplicateActive
            await setActiveCombo(itemName, duplicateActive[index].active);
            setActiveLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productInfo = await getComboInfo();
                if (productInfo !== null) {
                    const newItems = await Promise.all(productInfo.map(info => gettingImg(info.ogName, info.combo_desc)));

                    const itemsWithPrices = newItems.map((item, index) => ({
                        ...item,
                        price: productInfo[index].price,
                        combo_items: productInfo[index].combo_items,
                        active: productInfo[index].active, // Assign active state from fetched data
                        active_discount: productInfo[index].active_discount,
                        discount_amount: productInfo[index].discount_amount,
                        active_discount_price: productInfo[index].active_discount_price,
                        desc: productInfo[index].combo_desc,
                        name: productInfo[index].combo_name,
                        ogName: productInfo[index].ogName,
                    }));
                    setItems(itemsWithPrices);
                    setActive(itemsWithPrices.map(item => ({ active: item.active }))); // Initialize active state
                }
            } catch (error) {
                console.log("Error: " + error);
            } finally {
                setLoading(false); // Always ensure loading is set to false after data processing
            }
        };

        fetchData();
    }, []);

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

    const [remove, setRemove] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const comboRef = useRef<HTMLDivElement>(null);

    const closeRemoveModal = (e: React.MouseEvent) => {
        if (comboRef.current && e.target === comboRef.current) {
            setRemoveCombo(false);
        }
    };

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current && e.target === modalRef.current) {
            setRemove(false);
            setActiveIndex(null); // Close dropdown when modal closes
        }
    };

    const [selectedComboName, setSelectedComboName] = useState("");
    const [selectedComboItem, setSelectedComboItem] = useState("");

    const passVars = (comboName: string, comboItem: string) => {
        setSelectedComboName(comboName);
        setSelectedComboItem(comboItem);
    };

    const handleShowMore = () => {
        setDisplayCount(items.length); // Show all items
    };

    const handleShowLess = () => {
        setDisplayCount(3); // Show only initial 3 items
    };

    // 10, item.price, item.name, item.combo_items
    const discountCalculate = (discountValue: number, price: string, name: string, comboItems: ComboItem[]) => {
        console.log("name")
        console.log(name)
        let updatedValue;
        let updatedPrice;

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
            const originalPrice = parseFloat(price);
            updatedPrice = originalPrice.toFixed(2);
            setDiscountedCheck(true);
            setDiscountedCheckReturn(updatedPrice);
            setDiscountPercentage(updatedValue * 100);
        } else {
            const originalPrice = parseFloat(price);
            const discountedPrice = originalPrice * (1 - updatedValue);
            updatedPrice = discountedPrice.toFixed(2);
            setDiscountedCheck(true);
            setDiscountedCheckReturn(updatedPrice);
            setDiscountedItemName(name);
            setDiscountPercentage(updatedValue * 100);
        }

        // setSelectedItem({ name, price, combo_items: comboItems }); // Set selected item for discount modal
    };

    const handleDiscountSubmit = () => {
        if (discountedCheckReturn) {
            submitComboDiscount(discountedCheckReturn, discountPercentage, discountedItemName);
            setRemove(false);
            setDone(true);
            setDoneMessage("Discount has successfully been applied! ");
            setTimeout(() => {
                window.location.reload();
            }, 700)
        }
    }
    const closeDiscountModal = (e: React.MouseEvent) => {
        if (discountRef.current && e.target === discountRef.current) {
            setApplyingDiscount(false);
            // setSelectedItem(null);
            setDiscountedCheckReturn(false);
            setDiscountedCheckReturn(null);
            setDiscountedItemName(null);
            setDiscountPercentage(null);
        }
    };

    const handleReviewPriceClick = (index: number) => {
        toggleDropdown(index);
    };

    const toggleDropdown = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const verifyMultiSelect = () => {
        // make sure there is at least 2 and less than 5
        try {
            if (selectedProducts.length > 5 || selectedProducts.length < 2) {

            }
        } catch (error) {
            throw error;
        }
    }

    const updateCombo = () => {
        try {
            let isValid = true;
            // if the new description and namme length is less than one 
            if (trackNewComboName.length < 1) {
                setTrackNewComboName(trackComboName);
            }
            if (trackNewComboDesc.length < 1) {
                setTrackNewComboDesc(trackComboDesc);
            }
            if (selectedProducts.length > 5 || selectedProducts.length < 2) {
                setComboItemErr(true);
                setComboItemErrMsg("");
                isValid = false;
            }
            if (isValid) {
                updateComboInfo(trackComboName, trackNewComboName, trackNewComboDesc, selectedProducts)
                // console.log("trackComboName")
                // console.log(trackComboName)
                // console.log("trackNewComboName")
                // console.log(trackNewComboName)
                // console.log("trackNewComboDesc")
                // console.log(trackNewComboDesc)
                // console.log("selectedProducts")
                // console.log(selectedProducts)
            }
        } catch (error) {
            throw error;
        }
    }

    const [removeCombo, setRemoveCombo] = useState(false);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);

    const handleRemoveOne = async () => {
        try {
            // Set removing state to true
            setIsRemoving(true);
            // Perform the deletion
            await deleteCombo(trackComboName);
            setDoneMessage('You have successfully deleted "' + trackComboName + '"');
            setDone(true);
            // Optionally reload the page or handle navigation
            setTimeout(() => {
                window.location.reload();
            }, 700);
        } catch (error) {
            console.error('Error deleting combo:', error);
        } finally {
            // Reset removing state
            setIsRemoving(false);
        }
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
            <h1 className='text-center text-custom-green italic text-[6rem]'>Combos</h1>
            {options && (
                <div
                    ref={optionsRef}
                    className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeOptionsModal}
                >
                    <div className="overflow-auto bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5 overflow-y-scroll max-h-[35rem]">
                        <h2 className="text-2xl sm:text-[1.75rem] font-bold mb-4">Settings for {trackComboName}</h2>
                        <div className='w-full'>
                            <h1 className='text-[1.2rem] font-medium'>Edit Combo Details</h1>
                            <Input
                                divClass="py-4 w-full mt-0"
                                typeInfo='new_name'
                                type='text'
                                name='Combo Name'
                                onChange={handleNewComboName}
                                value={trackNewComboName || trackComboName}
                                className={`w-full ${comboNameErr ? 'ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6' : ''}`}
                            />
                            {comboNameErr && <h1 className="text-red-600">{comboNameErrMsg}</h1>}

                            <TextArea
                                divClass="w-full mt-0"
                                typeInfo='new_name'
                                type='text'
                                name='Combo Description'
                                value={trackNewComboDesc || trackComboDesc}
                                onChange={handleNewComboDesc}
                                className={`text-xl w-full min-h-36 max-h-60 ${comboDescErr ? 'ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset' : 'text-xl'}`}
                            />
                            {comboDescErr && <h1 className="text-red-600">{comboDescErrMsg}</h1>}

                            <div className='block w-full mt-4'>
                                <label htmlFor="items" className="block text-sm font-medium leading-6 text-custom-green text-[1.05rem] mb-0">Items</label>
                                <MultiSelect
                                    options={allProducts}
                                    value={selectedProducts}
                                    onChange={setSelectedProducts}
                                    labelledBy={"Select"}
                                    className={`w-full min-h-20 max-h-40 rounded-md border-custom-green ${comboItemErr ? 'ring-red-600 outline-red-600' : 'outline-custom-green ring-custom-green'}`}
                                    overrideStrings={{
                                        selectSomeItems: "Select Products",
                                        allItemsAreSelected: "All Products are selected",
                                        selectAll: "Select All",
                                        search: "Search"
                                    }}
                                />
                                {comboItemErr && <h1 className="text-red-600">{comboItemErrMsg}</h1>}
                            </div>

                            <div className='block w-full -mt-4 mb-7'>
                                <center>
                                    <FormSubmitBtn
                                        className="w-full"
                                        onClick={async () => {
                                            await updateCombo();
                                            setDone(true);
                                            setDoneMessage("You've successfully updated the combo details!");
                                            setTimeout(() => window.location.reload(), 700);
                                        }}>Confirm Changes</FormSubmitBtn>
                                </center>
                            </div>

                            <div className='mt-4'>
                                <h1 className='text-[1.2rem] font-medium'>Delete Combo</h1>
                                <button
                                    onClick={() => {
                                        setOptions(false);
                                        document.body.classList.remove('no-scroll');
                                        setRemoveCombo(true);
                                    }}
                                    className='text-red-600 hover:underline cursor-pointer mt-1 text-[1rem]'
                                >
                                    Delete "{trackComboName}"
                                </button>
                            </div>
                        </div>

                        {done && (
                            <div className="fixed inset-0 bg-transparent bg-opacity-50 justify-center items-center z-60 flex">
                                <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 z-50 translate-y-[20rem]" role="alert">
                                    <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <div>
                                        <span className="font-medium">Success</span>
                                        <p>{doneMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {
                removeCombo && (
                    <div
                        ref={comboRef}
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                        onClick={closeRemoveModal}
                    >
                        <div className="flex items-end justify-center text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Remove Combo</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">Are you sure you want to remove this combo? It will be deleted forever.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        onClick={async () => {
                                            // Await the handleRemoveOne to ensure state updates properly
                                            setIsRemoving(true)
                                            await handleRemoveOne();
                                            setIsRemoving(false)
                                        }}
                                    >
                                        {isRemoving ? 'Removing...' : 'Remove'}</button>
                                    <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => {
                                        setRemoveCombo(false);
                                        setOptions(true)
                                        document.body.classList.remove('no-scroll');
                                    }}>Cancel</button>
                                </div>
                            </div>
                        </div>
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
                    </div >
                )
            }
            {
                applyingDiscount && items.slice(0, displayCount).map((item, index) => (

                    <div
                        key={index}
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 justify-center items-center z-40 flex"
                        ref={discountRef}
                        onClick={closeDiscountModal}
                    >
                        <div
                            className="overflow-auto bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5"
                        >
                            <h2 className="text-xl font-bold mb-4">Discount Details for {item.name}</h2>
                            <center><h3 className="mb-4 font-semibold text-gray-900">Discount percentage</h3></center>
                            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-license" type="radio" value="0" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(0, item.price, item.name, item.combo_items)} />
                                        <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(0, item.price, item.name, item.combo_items)}>0%</label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-id" type="radio" value="10" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(10, item.price, item.name, item.combo_items)} />
                                        <label htmlFor="horizontal-list-radio-id" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(10, item.price, item.name, item.combo_items)}>10%</label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-military" type="radio" value="15" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(15, item.price, item.name, item.combo_items)} />
                                        <label htmlFor="horizontal-list-radio-military" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(15, item.price, item.name, item.combo_items)}>15%</label>
                                    </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-passport" type="radio" value="20" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(20, item.price, item.name, item.combo_items)} />
                                        <label htmlFor="horizontal-list-radio-passport" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(20, item.price, item.name, item.combo_items)}>20%</label>
                                    </div>
                                </li>
                                <li className="w-full">
                                    <div className="flex items-center ps-3">
                                        <input id="horizontal-list-radio-custom" type="radio" value="25" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onClick={() => discountCalculate(25, item.price, item.name, item.combo_items)} />
                                        <label htmlFor="horizontal-list-radio-custom" className="w-full py-3 ms-2 text-sm font-medium text-gray-900" onClick={() => discountCalculate(25, item.price, item.name, item.combo_items)}>25%</label>
                                    </div>
                                </li>
                            </ul>

                            {/* Table to display sizes, original prices, and discounted prices */}
                            <div className="mt-4">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-200 divide-y divide-gray-200 overflow-y-auto">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            {/* <th scope="col" className="px-6 py-3 text-left">Size</th> */}
                                            <th scope="col" className="px-6 py-3 text-left">Original Price</th>
                                            {/* {discountSelected && <th scope="col" className="px-6 py-3 text-left">Discounted Price</th>} */}
                                            {discountedCheck && <th scope="col" className="px-6 py-3 text-left">Discounted Price</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">

                                        <tr key="1">
                                            {/* <td className="px-6 py-4 whitespace-nowrap">{sizePrice.size}</td> */}
                                            <td className="px-6 py-4 whitespace-nowrap">${item.price}</td>
                                            {/* Display discounted price based on discount calculation */}
                                            {/* 
                                        const [discountedCheck, setDiscountedCheck] = useState<boolean | null>(null);
                                        const [discountedCheckReturn, setDiscountedCheckReturn] = useState<any>(null);
                                        */}
                                            {discountedCheck && <td className="px-6 py-4 whitespace-nowrap">${discountedCheckReturn}</td>}
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4">
                                <center>
                                    <FormSubmitBtn
                                        onClick={() => handleDiscountSubmit()}
                                        pendingText='Making Changes...'>
                                        Confirm Discount
                                    </FormSubmitBtn>
                                </center>
                                {done && (
                                    <div
                                        className="fixed inset-0 bg-transparent bg-opacity-50 justify-center items-center z-60 flex"
                                    >
                                        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 z-50 translate-y-[20rem]" role="alert">
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
                    </div >
                ))
            }
            {
                remove && (
                    <div
                        ref={modalRef}
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40"
                        onClick={closeModal}
                    >
                        <div className="flex items-end justify-center text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Remove combo item</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">Are you sure you want to remove this combo item? It will be deleted forever. If this is the final combo item the product will be gone.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        onClick={() => {
                                            deleteComboItem(selectedComboName, selectedComboItem);
                                            setDone(true);
                                            setDoneMessage("Successfully deleted product from combo! ")
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 700);
                                        }}
                                    >
                                        Deactivate
                                    </button>
                                    <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setRemove(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
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
                    </div >
                )
            }
            {
                loading && (
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
                )
            }
            {
                !loading && items.slice(0, displayCount).map((item, index) => (
                    <div className="w-full p-0 mx-auto border-none outline-none" key={index}>
                        {/* <div className='bg-green-200 rounded-xl w-3/4 xl:w-3/4 lg:w-full mx-auto block justify-center items-center'> */}
                        <div className='p-4 bg-gray-100 rounded-lg shadow-md mb-4 w-full'>
                            <div className='md:w-full p-4 md:flex block align-middle items-center justify-center'>
                                <div className='align-center items-center justify-center mb-4 md:mb-0 md:w-1/2 md:px-0'>
                                    <img
                                        src={item.image || defaultPfp}
                                        alt={item.name}
                                        width={500} // Fixed width
                                        height={500} // Fixed height
                                        className='object-cover product-image w-[500px] h-[250px]' // CSS class for styling
                                        loading='lazy'
                                    />
                                </div>

                                <div className='text-center md:text-left md:w-1/2 md:ml-4'>
                                    <h1 className='text-xl font-bold mt-2'>{item.name}</h1>
                                    <ul>
                                        {item.combo_items.map((comboItem, idx) => (
                                            <li key={idx}>{comboItem.label}&nbsp;&nbsp;<br className="xl:hidden text-lg" />
                                                <a className='text-red-600 hover:underline hover:cursor-pointer' onClick={() => {
                                                    passVars(item.name, comboItem.label);
                                                    setRemove(true);
                                                }}>Remove</a>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className='pt-[3rem]'>
                                        <label>
                                            Activate listing:
                                            <input
                                                type="checkbox"
                                                checked={active[index]?.active}
                                                onChange={() => toggleChecked(item.name, index)}
                                            />
                                        </label>
                                    </div>


                                    {/*  */}
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
                                                // setSelectedItem(item); // Set selected item for discount modal
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
                                                setTrackComboName(items[index].name);
                                                setTrackComboDesc(items[index].desc);
                                                setTrackComboItems(items[index].combo_items)
                                                // Push the item to selectedProducts
                                                item.combo_items.forEach((comboItem) => {
                                                    selectedProducts.push(comboItem);
                                                });
                                                setOptions(true);
                                                document.body.classList.add('no-scroll');
                                            }}
                                            className='bg-custom-green text-white py-2 px-4 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-custom-green'
                                        >

                                            <center>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </center>

                                        </button>
                                    </div>
                                    <div className='block'>
                                        <ul ref={el => (dropdownRefs.current[index] = el)} className={`mt-2 ${activeIndex === index ? 'block' : 'hidden'}`} style={{ textAlign: 'center' }}>
                                            {item.active_discount && <li className='flex justify-between items-center py-2 px-4 bg-gray-200 rounded-md mb-2'>${item.active_discount_price} (%{item.discount_amount})</li>}
                                            {!item.active_discount && <li className='flex justify-between items-center py-2 px-4 bg-gray-200 rounded-md mb-2'>${item.price}</li>}
                                        </ul>
                                    </div>
                                    {/*  */}


                                </div>
                                <div>
                                </div>
                            </div>
                            {/* */}
                            {/*  */}
                        </div>
                    </div >
                ))
            }
            {
                displayCount < items.length && (
                    <div className='pt-4 flex justify-center w-full'>
                        <center className='w-3/4 sm:w-full'>
                            <FormSubmitBtn
                                className='bg-blue-600 h-[3rem] pt-[.6rem] hover:bg-blue-500 w-full xl:w-3/4'
                                pendingText='Displaying more...'
                                onClick={handleShowMore}
                            >
                                Show more
                            </FormSubmitBtn>
                        </center>
                    </div>
                )
            }
            {
                displayCount >= items.length && items.length > 3 && (
                    <div className='pt-4 flex justify-center w-full'>
                        <center className='w-3/4 sm:w-full'>
                            <FormSubmitBtn
                                className='bg-blue-600 h-[3rem] pt-[.6rem] hover:bg-blue-500 w-full xl:w-3/4'
                                pendingText='Displaying less...'
                                onClick={handleShowLess}
                            >
                                Show less
                            </FormSubmitBtn>
                        </center>
                    </div>
                )
            }
        </>
    );
}


export default ComboProductLayout;