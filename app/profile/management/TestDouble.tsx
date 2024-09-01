'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import FormSubmitBtn from '@/app/components/forms/FormSubmitBtn';
import 'react-loading-skeleton/dist/skeleton.css';
import Form from '@/app/components/forms/Form';
import Input from '@/app/components/forms/Input';
import TextArea from '@/app/components/forms/TextArea';
import { addProductData } from './itemUploadComponents/addProductData';
import addProductImg from './itemUploadComponents/addProductImg';
import 'animate.css';
import { MultiSelect } from 'react-multi-select-component';
import duplicateProducts from './itemUploadComponents/duplicateProduct';


const TestDouble = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [comboPrice, setComboPrice] = useState<string>('');

    const [itemName, setItemName] = useState<string>('');
    const [itemDesc, setItemDesc] = useState<string>('');

    const [imgErr, setImgErr] = useState(false);
    const [imgErrMsg, setImgErrMsg] = useState("");

    const [sizes, setSizes] = useState({
        small: false,
        medium: false,
        large: false
    });

    const [filter, setFilter] = useState({
        asian: false,
        indian: false,
        western: false,
        african: false,
        middleEastern: false,
        spanish: false,
        fusion: false,
        fastFood: false,
    });

    const modalRef = useRef<HTMLDivElement>(null);

    const [itemNameErr, setItemNameErr] = useState(false);
    const [itemDescErr, setItemDescErr] = useState(false);
    const [itemPriceErr, setItemPriceErr] = useState(false);
    const [itemSpiceErr, setItemSpiceErr] = useState(false);
    const [itemSizeErr, setItemSizeErr] = useState(false);

    const [itemNameErrMsg, setItemNameErrMsg] = useState('');
    const [itemDescErrMsg, setItemDescErrMsg] = useState('');
    const [itemPriceErrMsg, setItemPriceErrMsg] = useState('');
    const [itemSpiceErrMsg, setItemSpiceErrMsg] = useState("");
    const [itemSizeErrMsg, setItemSizeErrMsg] = useState("");

    const [imgDataResponse, setImgDataResponse] = useState(false);
    const [dataResponse, setDataResponse] = useState(false);

    const [done, setDone] = useState(false);
    // const [dataError, setDataError] = useState(false);
    // const [imgError, setImgError] = useState(false);
    // const [bothError, setBothError] = useState(false);

    const [selectedSpice, setSelectedSpice] = useState<any>([]);

    const [inputs, setInputs] = useState([
        { id: 1, price: '', size: '' }
    ]);
    const [productFilter, setProductFilter] = useState([
        { id: 1, filter: "" }
    ]);

    const [nameCheck, setNameCheck] = useState<boolean | null>(null)

    const [productFilterErr, setProductFilterErr] = useState<boolean | null>(false);
    const [productFilterErrMsg, setProductFilterErrMsg] = useState<string | null>("");


    const submitForm = useCallback(
        async (formData: FormData) => {
            let isValid = true;

            const newInputs = [...inputs];
            const spices = [...selectedSpice];

            selectedFiles.forEach((file, index) => {
                formData.append(`file${index}`, file);
            });

            const validSizes = ["small", "medium", "large"];
            const sizes = inputs.map(input => input.size);
            const uniqueSizes = new Set(sizes);
            const validSizesFinal = sizes.every(size => validSizes.includes(size) && size && size !== 'null') && uniqueSizes.size === sizes.length;

            try {
                const duplicate = await duplicateProducts(itemName);
                setNameCheck(duplicate); // Update nameCheck state with duplicate result

                if (duplicate && currentStep === 2) {
                    setItemNameErr(true);
                    setItemNameErrMsg("Can't have two of the same product names.");
                    isValid = false;
                }

                if (!validSizesFinal && currentStep === 2) {
                    setItemSizeErr(true);
                    setItemSizeErrMsg("You cannot have the same size more than once. Or leave the field empty.");
                    isValid = false;
                }

                if (spices.length < 1 && currentStep === 2) {
                    setItemSpiceErr(true);
                    setItemSpiceErrMsg("Need to at least select one spice level.");
                    isValid = false;
                }

                if ((itemName.length < 5 || itemName.length > 25) && currentStep === 2) {
                    setItemNameErr(true);
                    setItemNameErrMsg('Combo name must be between 5 and 25 characters.');
                    isValid = false;
                }

                if ((itemDesc.length < 100 || itemDesc.length > 450) && currentStep === 2) {
                    setItemDescErr(true);
                    setItemDescErrMsg('Combo description must be between 100 and 450 characters.');
                    isValid = false;
                }

                const isPriceValid = (price: any) => {
                    const priceValue = parseFloat(price);
                    return !isNaN(priceValue) && priceValue >= 1.00 && priceValue <= 999.99;
                };

                const prices = inputs.map(input => input.price);
                const arePricesValid = prices.every(price => price && isPriceValid(price));

                if (!arePricesValid && currentStep === 2) {
                    setItemPriceErr(true);
                    setItemPriceErrMsg("Prices cannot be empty, exceed 999.99, or be less than 1.00.");
                    isValid = false;
                }

                if (productFilter[0].filter === "" && currentStep === 2) {
                    setProductFilterErr(false);
                    setProductFilterErrMsg("You must select one.");
                    isValid = false;
                }

                if (!isValid || nameCheck) {
                    isValid = false; // Ensure isValid is false if nameCheck is true
                }

                if (isValid && currentStep === 2 && !nameCheck) {
                    try {
                        const dataReturnValue = await addProductData(formData, newInputs, spices, productFilter);
                        if (dataReturnValue === true) {
                            setDataResponse(true);
                        } else {
                            setDataResponse(false);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    try {
                        const imgReturnValue = await addProductImg(formData);
                        if (imgReturnValue === true) {
                            setImgDataResponse(true);
                        } else {
                            setImgDataResponse(false);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.error('Error checking duplicate:', error);
            }
        },
        [sizes, selectedFiles, currentStep, inputs, itemName, itemDesc, selectedSpice, nameCheck]
    );



    useEffect(() => {
        if (dataResponse && imgDataResponse) {
            try {
                setCurrentStep(0);
                setDone(true);
                setTimeout(() => {
                    // router.push("/profile/management")
                    window.location.reload();
                }, 100)
            } catch (error) {
                console.log(error);
            }
        }
    }, [dataResponse, imgDataResponse]);


    const handleStep = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handleBackStep = () => {
        setCurrentStep(prevState => prevState - 1);
    };

    const handleNextStep = () => {
        if (selectedFiles.length < 1) {
            setImgErr(true);
            setImgErrMsg("You need to upload at least one image for this combo!");
            return;
        } else {
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    const handleItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemName(event.target.value);
    };

    const handleDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemDesc(event.target.value);
    };

    const gettingPfp = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            if (selectedFiles.length < 5) {
                setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
            } else {
                console.log("more than 5");
            }
        }
    };

    const goToPreviousImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrentImageIndex(prevIndex =>
            prevIndex === 0 ? selectedFiles.length - 1 : prevIndex - 1
        );
    };

    const goToNextImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrentImageIndex(prevIndex =>
            prevIndex === selectedFiles.length - 1 ? 0 : prevIndex + 1
        );
    };

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current && e.target === modalRef.current) {
            setCurrentStep(0);
        }
    };

    const formatNumberWithCommas = (value: string) => {
        let parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const spiceOptions = [
        { label: "Normal", value: "normal" },
        { label: "Mild", value: "mild" },
        { label: "Medium", value: "medium" },
        { label: "Hot", value: "hot" },
        { label: "Extra hot", value: "extra-hot" },
    ];

    const handleSpiceChange = (value: string, label: string) => {
        const selectedSpiceItem = { label: label, value: value };
        if (!selectedSpice.some((spice: any) => spice.value === value)) {
            setSelectedSpice((prev: any) => [...prev, selectedSpiceItem]);
        } else {
            setSelectedSpice((prev: any[]) => prev.filter(spice => spice.value !== value));
        }
    };

    const handleAddInput = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (inputs.length === 3) {
            return;
        } else {
            const newInput: any = {
                id: inputs.length + 1,
                price: '',
                size: '',
            };
            setInputs([...inputs, newInput]);
        }
    };

    const handleInputPriceChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputs = [...inputs];
        let usersValue = event.target.value;
        usersValue = usersValue.replace(/[^0-9.]/g, '');
        usersValue = formatNumberWithCommas(usersValue);
        newInputs[index].price = usersValue;
        setInputs(newInputs);
    };

    const handleInputSizeChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newInputs = [...inputs];
        newInputs[index].size = event.target.value;
        setInputs(newInputs);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newInputs = [...productFilter];
        newInputs[0].filter = event.target.value;
        setProductFilter(newInputs);
    };


    const handleRemoveInput = (index: number) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    const handleNumBlur = (index: any) => (event: any) => {
        const { value } = event.target;
        if (value !== '') {
            let roundedValue = parseFloat(value.replace(/,/g, '')).toFixed(2);
            roundedValue = formatNumberWithCommas(roundedValue);
            const newInputs = [...inputs];
            newInputs[index].price = roundedValue;
            setInputs(newInputs);
        }
    };

    const [portionSize, setPortionSize] = useState<any[]>([]);

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const existingIndex = portionSize.findIndex(item => item.id === index + 1);
        if (existingIndex !== -1) {
            setPortionSize(prevState => {
                const updatedState = [...prevState];
                updatedState[existingIndex] = {
                    ...updatedState[existingIndex],
                    size: event.target.value,
                };
                return updatedState;
            });
        } else {
            const newInput = {
                id: index + 1,
                size: event.target.value,
            };
            setPortionSize(prevState => [...prevState, newInput]);
        }
    };




    return (
        <div>
            {done && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div id="successModal" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                            <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
                                <button type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={() => setDone(false)}>
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="w-12 h-12 rounded-full bg-green-100 p-2 flex items-center justify-center mx-auto mb-3.5">
                                    <svg aria-hidden="true" className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="sr-only">Success</span>
                                </div>
                                <p className="mb-4 text-lg font-semibold text-gray-900">Successfully added product</p>
                                {/* Add additional content or buttons here as needed */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Form className='' action={submitForm} method={''}>
                <div className='pt-4 flex justify-center w-full'>
                    <center className='w-3/4 sm:w-full'>
                        <FormSubmitBtn
                            className='bg-custom-yellow h-[3rem] pt-[.6rem] hover:bg-custom-yellow w-full xl:w-3/4'
                            pendingText='Creating your template...'
                            onClick={handleStep}
                        >
                            New Item
                        </FormSubmitBtn>
                    </center>
                </div>
                {currentStep === 1 && (
                    <div
                        ref={modalRef}
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                        onClick={closeModal}
                    >
                        <div className="bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5">

                            <div className="flex items-center justify-center p-4 pb-7">
                                <ol className="items-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                                    <li className="flex items-center text-custom-green space-x-2.5 rtl:space-x-reverse">
                                        <span className="flex items-center justify-center w-8 h-8 border border-custom-green rounded-full shrink-0">
                                            1
                                        </span>
                                        <span>
                                            <h3 className="font-medium leading-tight">Product Images</h3>
                                            <p className="text-sm">Upload up to 5 images</p>
                                        </span>
                                    </li>
                                    <li className="flex items-center text-gray-500 space-x-2.5 rtl:space-x-reverse">
                                        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0">
                                            2
                                        </span>
                                        <span>
                                            <h3 className="font-medium leading-tight">Product Info</h3>
                                            <p className="text-sm">Listing info for the product</p>
                                        </span>
                                    </li>
                                </ol>
                            </div>

                            <hr className='p-4 border-gray-400' />

                            <div className='flex w-full p-4 justify-center align-middle items-center'>
                                <div>
                                    <input
                                        type="file"
                                        name="filePfp"
                                        accept="image/*"
                                        multiple
                                        onChange={gettingPfp}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-custom-yellow hover:file:bg-yellow-200 "
                                    />
                                    <div className='w-full p-4'>
                                        <div className='lg:hidden block'>
                                            {selectedFiles.length > 0 && (
                                                <div className='relative'>
                                                    <img
                                                        src={URL.createObjectURL(selectedFiles[currentImageIndex])}
                                                        alt={`Uploaded ${currentImageIndex + 1}`}
                                                        className='w-full h-full border-4 border-solid border-white object-cover mr-2'
                                                    />
                                                    {currentImageIndex > 0 && (
                                                        <button
                                                            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-500 text-white px-2 py-1 rounded"
                                                            onClick={goToPreviousImage}
                                                        >
                                                            &#8592;
                                                        </button>
                                                    )}
                                                    {currentImageIndex < selectedFiles.length - 1 && (
                                                        <button
                                                            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-500 text-white px-2 py-1 rounded"
                                                            onClick={goToNextImage}
                                                        >
                                                            &#8594;
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className='hidden lg:flex w-full p-4 justify-center items-center'>
                                            {selectedFiles.length > 0 && (
                                                <div className='w-1/2 h-full'>
                                                    <img
                                                        src={URL.createObjectURL(selectedFiles[currentImageIndex])}
                                                        alt={`Uploaded ${currentImageIndex + 1}`}
                                                        className='w-full h-full border-4 border-solid border-white object-cover mr-2'
                                                    />
                                                </div>
                                            )}
                                            <div className='w-1/2 grid grid-cols-2 gap-2'>
                                                {selectedFiles.length > 1 && selectedFiles.slice(1, 5).map((file, index) => (
                                                    <img
                                                        key={index + 1} // Use index + 1 to ensure keys remain unique and accurate
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Uploaded ${index + 2}`} // Adjust alt text to match the actual index
                                                        className='w-full h-full border-4 border-solid border-white object-cover'
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {imgErr && <h1>{imgErrMsg}</h1>}
                                        <div className="flex justify-center mx-auto mt-10 gap-20">
                                            <button onClick={handleNextStep} className="bg-custom-green text-white px-4 py-2 rounded">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 &&
                    <div
                        ref={modalRef}
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                        onClick={closeModal}
                    >
                        <div className="bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5 overflow-y-scroll max-h-[40rem] sm:max-h-full sm:overflow-hidden">

                            <div className='w-full'>
                                <div className="flex items-center justify-center p-2 pb-7">
                                    <ol className="items-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                                        <li className="flex items-center text-gray-500 space-x-2.5 rtl:space-x-reverse">
                                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0">
                                                1
                                            </span>
                                            <span>
                                                <h3 className="font-medium leading-tight">Product Images</h3>
                                                <p className="text-sm">Upload up to 5 images</p>
                                            </span>
                                        </li>
                                        <li className="flex items-center text-custom-green space-x-2.5 rtl:space-x-reverse">
                                            <span className="flex items-center justify-center w-8 h-8 border border-custom-green text-custom-green rounded-full shrink-0">
                                                2
                                            </span>
                                            <span>
                                                <h3 className="font-medium leading-tight">Product Info</h3>
                                                <p className="text-sm">Listing info for the product</p>
                                            </span>
                                        </li>
                                    </ol>
                                </div>
                                <hr className='p-4 border-gray-400' />
                                <div className='block w-full'>
                                    <div className='my-0 w-full'>
                                        <div className='w-full block md:flex gap-4'>

                                            <div className='w-full md:w-3/4 md:my-3'>
                                                <Input
                                                    // labelclassName='translate-x-11 sm:translate-x-0'
                                                    name='Item Name'
                                                    type='text'
                                                    typeInfo='item_name'
                                                    value={itemName}
                                                    onChange={handleItemName}
                                                    className={itemNameErr ? 'block w-3/4 sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3' : "w-full"}
                                                    placeholder='Product Name'
                                                />

                                                {itemNameErr && <h1 className='text-red-600'>{itemNameErrMsg}</h1>}
                                            </div>
                                            <div className='w-full md:w-1/4 my-0'>
                                                <label htmlFor="origin" className="block text-sm font-medium leading-6 text-custom-green pt-2">Food Origin</label>
                                                <select
                                                    id="origin"
                                                    className={productFilterErr ? "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 outline-red-600 border-red-600" : "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-custom-green focus:border-custom-green block w-full p-2.5 outline-custom-green border-custom-green"}
                                                    onChange={(e) => handleFilterChange(e)}
                                                    value={productFilter[0].filter}
                                                >
                                                    <option value="">Select a origin</option>
                                                    <option value="Asian">Asian</option>
                                                    <option value="Indian">Indian</option>
                                                    <option value="Western">Western</option>
                                                    <option value="African">African</option>
                                                    <option value="European">European</option>
                                                    <option value="Middle East">Middle East</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="Fusion">Fusion</option>
                                                    <option value="Fast Food">Fast Food</option>
                                                </select>
                                                {productFilterErr && <h1 className='text-red-600'>{productFilterErrMsg}</h1>}

                                            </div>
                                        </div>
                                        {/* blah blah blah */}

                                        {/* blah blah blah */}
                                        <div className='pt-4 w-full'>
                                            <TextArea
                                                // labelclassName='translate-x-11 sm:translate-x-0'
                                                name='Item Description'
                                                type='text-area'
                                                typeInfo='item_desc'
                                                value={itemDesc}
                                                onChange={handleDesc}
                                                className={itemDescErr ? 'min-h-20 max-h-40 block w-3/4 sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3' : "w-full min-h-20 max-h-40"}

                                                placeholder='Product Description'
                                            />
                                            {itemDescErr && <h1 className='text-red-600'>{itemDescErrMsg}</h1>}
                                        </div>
                                        {/*  */}

                                        <div className='hidden sm:block'>
                                            <div className='flex w-full pt-4 items-center justify-center'>
                                                <p className='text-custom-green'>Spice level</p>
                                            </div>
                                            <ul className={itemSpiceErr ? "items-center w-full text-sm font-medium text-gray-900 bg-white border border-red-600 rounded-lg sm:flex" : "items-center w-full text-sm font-medium text-gray-900 bg-white border border-custom-green rounded-lg sm:flex"}>
                                                {spiceOptions.map((option, index) => (
                                                    <li key={option.value} className={`w-full ${index === spiceOptions.length - 1 ? (itemSpiceErr ? "border-l border-red-600" : "border-l border-custom-green") : (itemSpiceErr ? "border-r border-b border-red-600 sm:border-b-0" : "border-r border-b border-custom-green sm:border-b-0")}`}>
                                                        <div className="flex items-center ps-3">
                                                            <input
                                                                type="checkbox"
                                                                id={option.value}
                                                                className={itemSpiceErr ? "w-4 h-4 text-red-600 border-red-600 rounded focus:ring-red-600 focus:ring-1 checked:bg-red-600 checked:border-red-600 accent-red-600" : "w-4 h-4 text-custom-green border-custom-green rounded focus:ring-custom-green focus:ring-1 checked:bg-custom-green checked:border-custom-green accent-custom-green"}
                                                                checked={selectedSpice.some((spice: any) => spice.value === option.value)}
                                                                onChange={() => handleSpiceChange(option.value, option.label)}
                                                            />
                                                            <label htmlFor={option.value} className="w-full py-3 ms-2 text-sm font-medium text-gray-600">{option.label}</label>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            {itemSpiceErr && <h1 className='hidden sm:block text-red-600'>{itemSpiceErrMsg}</h1>}
                                        </div>
                                        {/*  */}

                                        <div className={!itemSpiceErr ? 'w-full md:w-3/4 my-0 sm:hidden mx-auto' : "hidden"}>
                                            <label htmlFor="items" className={"block text-sm font-medium leading-6 text-custom-green"}>Spice level</label>
                                            <MultiSelect
                                                options={spiceOptions}
                                                value={selectedSpice}
                                                onChange={setSelectedSpice}
                                                labelledBy="Select"
                                                className=''
                                                overrideStrings={{
                                                    selectSomeItems: "Select Spice levels",
                                                    allItemsAreSelected: "All Spice levels are selected",
                                                    selectAll: "Select All",
                                                    search: "Search"
                                                }}
                                            />
                                        </div>
                                        <section className={itemSpiceErr ? 'w-full md:w-3/4 my-0 sm:hidden mx-auto' : "hidden"}>
                                            <label htmlFor="items" className={"block text-sm font-medium leading-6 text-custom-green"}>Spice level</label>
                                            <MultiSelect
                                                options={spiceOptions}
                                                value={selectedSpice}
                                                onChange={setSelectedSpice}
                                                labelledBy="Select"
                                                className=''
                                                overrideStrings={{
                                                    selectSomeItems: "Select Spice levels",
                                                    allItemsAreSelected: "All Spice levels are selected",
                                                    selectAll: "Select All",
                                                    search: "Search"
                                                }}
                                            />
                                        </section>
                                        {itemSpiceErr && <h1 className='block sm:hidden text-red-600'>{itemSpiceErrMsg}</h1>}

                                        {/*  */}
                                        {/* new one bew */}

                                        {/*  */}

                                        <div
                                            className='flex justify-center items-center w-full pt-4'
                                        >
                                            {/* here here */}
                                            <button
                                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                                onClick={handleAddInput}
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {inputs.map((input, index) => (
                                            <div className="block w-full md:flex md:gap-4">
                                                <div className='block w-full md:flex md:gap-4'>
                                                    <div className='w-full md:w-1/4 my-2'>
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
                                                                value={input.price}
                                                                onBlur={handleNumBlur(index)}
                                                                onChange={(e) => handleInputPriceChange(index, e)}
                                                                className={itemPriceErr ? 'rounded-md block w-full border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-red-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-6 outline-red-600 h-10' : "rounded-md block w-full border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-custom-green placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-custom-green text-sm leading-6 outline-custom-green h-10"}
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex items-center">
                                                                <label htmlFor="currency" className="sr-only">Currency</label>
                                                            </div>
                                                        </div>
                                                        {itemPriceErr ? <p className='text-left text-red-600'>{itemPriceErrMsg}</p> : ""}
                                                    </div>
                                                    <div className='w-full md:w-3/4 my-0'>
                                                        <label htmlFor="sizes" className="block text-sm font-medium leading-6 text-custom-green pt-2">Select a size</label>
                                                        <select
                                                            id="sizes"
                                                            className={itemSizeErr ? "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 outline-red-600 border-red-600" : "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-custom-green focus:border-custom-green block w-full p-2.5 outline-custom-green border-custom-green"}
                                                            onChange={(e) => handleInputSizeChange(index, e)}
                                                            value={input.size}
                                                        >
                                                            <option value="">Choose a size</option>
                                                            <option value="small">Small</option>
                                                            <option value="medium">Medium</option>
                                                            <option value="large">Large</option>
                                                        </select>
                                                        {itemSizeErr && <h1 className='text-red-600'>{itemSizeErrMsg}</h1>}

                                                    </div>
                                                    {/*  */}
                                                    {index !== 0 && (
                                                        <div className='flex items-center sm:pt-8 h-full'>
                                                            <button type="button" className="hidden sm:inline-flex bg-white rounded-md p-2 items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" onClick={() => handleRemoveInput(index)}>
                                                                <span className="sr-only">Close menu</span>
                                                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>

                                                            <a className='block sm:hidden text-red-600 underline'>
                                                                <span onClick={() => handleRemoveInput(index)}>Remove</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className='w-1/2 sm:flex '>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex xl:gap-10 gap-5 justify-center align-middle pt-4 w-full'>
                                <div className="w-full flex justify-between mt-4">
                                    <button onClick={() => setCurrentStep(1)} className="bg-gray-400 text-white px-4 py-2 rounded">
                                        Previous Step
                                    </button>
                                    <button onClick={closeModal} className="bg-custom-green text-white px-4 py-2 rounded">
                                        Finish
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div >
                }
            </Form >
        </div >
    );
};

export default TestDouble;