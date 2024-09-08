'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Input from '@/app/components/forms/Input';
import TextArea from '@/app/components/forms/TextArea';
import Form from '@/app/components/forms/Form';
import { MultiSelect } from 'react-multi-select-component';
import FormSubmitBtn from '@/app/components/forms/FormSubmitBtn';
import getProductNames from './comboUploadComponents/getProductNames';
import { uploadComboData } from './comboUploadComponents/uploadComboData';
import uploadComboImg from './comboUploadComponents/uploadComboImg';
import duplicateComboItem from './comboUploadComponents/duplicateComboItem';

const ComboClient: React.FC = () => {
    const [submitMsg, setSubmitMsg] = useState("Finish");
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedCities, setSelectedCities] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [comboName, setComboName] = useState('');
    const [comboDesc, setComboDesc] = useState('');

    const [comboNameErr, setComboNameErr] = useState(false);
    const [comboDescErr, setComboDescErr] = useState(false);
    const [comboItemErr, setComboItemErr] = useState(false);
    const [comboPriceErr, setComboPriceErr] = useState(false);
    const [comboImgErr, setComboImgErr] = useState(false);

    const [comboImgErrMsg, setComboImgErrMsg] = useState("");
    const [comboNameErrMsg, setComboNameErrMsg] = useState('');
    const [comboDescErrMsg, setComboDescErrMsg] = useState('');
    const [comboItemErrMsg, setComboItemErrMsg] = useState('');
    const [comboPriceErrMsg, setComboPriceErrMsg] = useState('');
    const [comboItems, setComboItems] = useState('');
    const [comboPrice, setComboPrice] = useState<string>('');
    const [allProducts, setAllProducts] = useState<{ value: string, label: string }[]>([]);
    const [productFilterErr, setProductFilterErr] = useState<boolean | null>(false);
    const [productFilterErrMsg, setProductFilterErrMsg] = useState<string | null>("");

    const [productFilter, setProductFilter] = useState([
        { id: 1, filter: "" }
    ]);

    const openModal = () => {
        setIsOpen(true);
        // Reset error states when modal opens
        setComboNameErr(false);
        setComboNameErrMsg('');
        setComboDescErr(false);
        setComboDescErrMsg('');
        setComboItemErr(false);
        setComboItemErrMsg('');
        setComboPriceErr(false);
        setComboPriceErrMsg('');
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
            setIsOpen(false);
            setCurrentStep(1);
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComboName(event.target.value);
    };

    const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComboDesc(event.target.value);
    };

    const handleNextStep = () => {
        // Check if at least two images are uploaded
        if (selectedFiles.length < 1) {
            // Display an error message or handle it as per your UI/UX design
            setComboImgErr(true)
            setComboImgErrMsg("You need to upload at least one image for this combo!")
            return; // Prevent proceeding to the next step
        }

        // Proceed to the next step
        setCurrentStep(prevStep => prevStep + 1);


    };


    const handlePrevStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Remove any non-numeric characters except decimal point
        value = value.replace(/[^0-9.]/g, '');

        // Format number with commas
        value = formatNumberWithCommas(value);

        setComboPrice(value);
    };

    const handleInputBlur = () => {
        // Round the input value to two decimal places
        if (comboPrice !== '') {
            let roundedValue = parseFloat(comboPrice.replace(/,/g, '')).toFixed(2);
            roundedValue = formatNumberWithCommas(roundedValue);
            setComboPrice(roundedValue);
        }
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newInputs = [...productFilter];
        newInputs[0].filter = event.target.value;
        setProductFilter(newInputs);
        console.log(productFilter);
    };

    const formatNumberWithCommas = (value: string) => {
        // Split the value into parts before and after decimal
        let parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
        return parts.join('.');
    };

    const [done, setDone] = useState(false);
    const [dataResponse, setDataResponse] = useState(false);
    const [imgDataResponse, setImgDataResponse] = useState(false);
    const [comboDuplicate, setComboDuplicate] = useState<boolean | null>(false);

    const submitForm = useCallback(
        async (formData: FormData) => {
            setSubmitMsg("Submitting...");
            try {
                let isValid = true;

                // Check for duplicate combo name
                const duplicate = await duplicateComboItem(comboName);
                setComboDuplicate(duplicate); // Update comboDuplicate state

                // Validate combo name
                if ((comboName.length < 5 || comboName.length > 25) && currentStep === 2) {
                    setComboNameErr(true);
                    setComboNameErrMsg('Combo name must be between 5 and 25 characters.');
                    isValid = false;
                }

                // Validate combo description
                if ((comboDesc.length < 100 || comboDesc.length > 450) && currentStep === 2) {
                    setComboDescErr(true);
                    setComboDescErrMsg('Combo description must be between 100 and 450 characters.');
                    isValid = false;
                }

                // Validate combo price
                if (parseFloat(comboPrice.replace(/,/g, '')) > 1000.00 && currentStep === 2) {
                    setComboPriceErr(true);
                    setComboPriceErrMsg('Combo price cannot exceed 1000.00.');
                    isValid = false;
                }

                // if its empty
                if ((comboPrice.trim() === '' || parseFloat(comboPrice.replace(/,/g, '')) > 1000.00) && currentStep === 2) {
                    setComboPriceErr(true);
                    setComboPriceErrMsg('Combo price cannot be empty.');
                    isValid = false;
                }


                // Validate selected products
                if (selectedProducts.length < 2 && currentStep === 2) {
                    setComboItemErr(true);
                    setComboItemErrMsg('You need at least two individual items for a combo.');
                    isValid = false;
                }

                if (productFilter[0].filter === "" && currentStep === 2) {
                    setProductFilterErr(false);
                    setProductFilterErrMsg("You must select one.");
                    isValid = false;
                }

                if (comboDuplicate) {
                    setComboNameErr(true);
                    setComboNameErrMsg("You cannot have 2 of the same combo names.");
                    return;
                }

                // If any validation fails, return early
                if (!isValid) {
                    return;
                }

                // If validation passes, proceed to upload images and data
                selectedFiles.forEach((file, index) => {
                    formData.append(`file${index}`, file);
                });

                if (isValid && currentStep === 2 && !comboDuplicate) {
                    try {
                        // Upload images
                        const imgReturn = await uploadComboImg(formData);
                        setImgDataResponse(imgReturn); // Assuming imgReturn is a boolean indicating success or failure

                        // Upload data
                        const dataReturn = await uploadComboData(formData, selectedProducts, productFilter);
                        if (dataReturn !== null && dataReturn !== undefined) {
                            setDataResponse(dataReturn); // Assuming dataReturn is a boolean indicating success or failure
                        }
                    } catch (error) {
                        console.error('Error uploading combo:', error);
                    }
                }
            } catch (error) {
                throw error;
            }
            setSubmitMsg("Finish");
        },
        [selectedFiles, selectedProducts, comboName, comboDesc, comboPrice, comboDuplicate]
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productInfo = await getProductNames(); // Replace with your actual API call
                const mappedProducts: { value: string, label: string, ogValue: string }[] = [];

                if (productInfo) {
                    productInfo.forEach(product => {
                        // Extract the `ogName` for the current product
                        const ogName = product.ogName;

                        // Iterate over price_size
                        product.price_size.forEach((size: any) => {
                            mappedProducts.push({
                                value: `${product.product_name}-${size.size}`,
                                label: `${product.product_name} - ${size.size}`,
                                ogValue: ogName // Include ogName here
                            });
                        });
                    });

                    // Update the state with the mapped products
                    setAllProducts(mappedProducts);
                    console.log(mappedProducts); // Log the mapped products with sizes and prices
                }
            } catch (error) {
                console.error("Error fetching product info:", error);
            }
        };

        fetchData();
    }, []);



    const gettingPfp = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            // Reset image error message when at least one file is selected
            if (filesArray.length > 0) {
                setComboImgErr(false);
                setComboImgErrMsg('');
            }

            if (selectedFiles.length < 5) {
                setSelectedFiles(prevFiles => [...prevFiles, ...filesArray.slice(0, 5 - prevFiles.length)]);
            } else {
                setComboImgErr(true);
                setComboImgErrMsg('You already have 5 images!');
            }
        }
    };

    useEffect(() => {
        // Disable scrolling on body when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to re-enable scrolling when modal is closed
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

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
                                <p className="mb-4 text-lg font-semibold text-gray-900">Successfully added combo</p>
                                {/* Add additional content or buttons here as needed */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* <div className="pt-4 flex justify-center w-full">
                <FormSubmitBtn
                    className='bg-custom-yellow h-[3rem] pt-[.6rem] hover:bg-yellow-400 w-full xl:w-3/4'
                    pendingText='Creating your template...'
                    onClick={openModal}
                >
                    New Combo
                </FormSubmitBtn>
            </div> */}
            <div className='pt-4 flex justify-center w-full'>
                <center className='w-3/4 sm:w-full'>
                    <FormSubmitBtn
                        className='bg-custom-yellow h-[3rem] pt-[.6rem] hover:bg-custom-yellow w-full xl:w-3/4'
                        pendingText='Displaying more...'
                        onClick={openModal}
                    >
                        Add Combo
                    </FormSubmitBtn>
                </center>
            </div>
            {isOpen && ReactDOM.createPortal(

                <Form className='' action={submitForm} method=''>
                    {currentStep === 1 && (
                        <div
                            ref={modalRef}
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                            onClick={closeModal}
                        >
<div className="overflow-auto bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5 overflow-y-scroll max-h-[35rem]">
                                {/* {currentStep === 1 && ( */}

                                <div className="flex items-center justify-center p-4 pb-7">
                                    {/* showing the user the process of the step form */}
                                    <ol className="items-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                                        <li className="flex items-center text-custom-green space-x-2.5 rtl:space-x-reverse">
                                            <span className="flex items-center justify-center w-8 h-8 border border-custom-green rounded-full shrink-0">
                                                1
                                            </span>
                                            <span>
                                                <h3 className="font-medium leading-tight">Combo Images</h3>
                                                <p className="text-sm">Upload up to 5 images</p>
                                            </span>
                                        </li>
                                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                                2
                                            </span>
                                            <span>
                                                <h3 className="font-medium leading-tight">Combo Information</h3>
                                                <p className="text-sm">Listing details for the combo</p>
                                            </span>
                                        </li>
                                    </ol>


                                </div>
                                {/* hr below the steps  */}
                                <hr className='p-4 border-gray-400' />

                                {/* input that accepts the images */}
                                <input
                                    type="file"
                                    name="filePfp"
                                    accept="image/*"
                                    multiple
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-custom-yellow hover:file:bg-yellow-200"
                                    onChange={gettingPfp}
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
                                    {comboImgErr && <div className='flex justify-center items-center'>
                                        <h1>{comboImgErrMsg}</h1>
                                    </div>}
                                    <div className='flex items-center justify-center'>
                                        <button onClick={handleNextStep} className="bg-custom-green text-white px-4 py-2 rounded mt-4">
                                            Next
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div
                            ref={modalRef}
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                            onClick={closeModal}
                        >
<div className="overflow-auto bg-white p-4 rounded-lg shadow-lg h-auto w-3/4 lg:w-1/2 xl:w-2/5 overflow-y-scroll max-h-[35rem]">
                                <div className='w-full'>
                                    <div className="flex items-center justify-center p-4 pb-7">

                                        <ol className="items-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                                            <li className="flex items-center text-gray-500 space-x-2.5 rtl:space-x-reverse">
                                                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0">
                                                    1
                                                </span>
                                                <span>
                                                    <h3 className="font-medium leading-tight">User info</h3>
                                                    <p className="text-sm">Step details here</p>
                                                </span>
                                            </li>
                                            <li className="flex items-center text-custom-green space-x-2.5 rtl:space-x-reverse">
                                                <span className="flex items-center justify-center w-8 h-8 border border-custom-green text-custom-green rounded-full shrink-0">
                                                    2
                                                </span>
                                                <span>
                                                    <h3 className="font-medium leading-tight">Company info</h3>
                                                    <p className="text-sm">Step details here</p>
                                                </span>
                                            </li>
                                        </ol>


                                    </div>
                                    <hr className='pt-4 border-gray-400' />

                                    <div className='block w-full'>
                                        <div className='w-full' >
                                            <div className='w-full block md:flex gap-4'>
                                                <div className='w-full md:w-3/4 md:my-3'>
                                                    <Input
                                                        // labelClass='translate-x-[2.5rem]'
                                                        placeholder='Combo Name...'
                                                        typeInfo='comboName'
                                                        type='text'
                                                        name='Combo Name'
                                                        onChange={handleNameChange}
                                                        value={comboName}
                                                        className={comboNameErr ? 'w-full block sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3' : "w-full"}
                                                    />
                                                    {comboNameErr ? <p className='text-red-600 text-left'>{comboNameErrMsg}</p> : ""}
                                                </div>
                                                <div className='w-full md:w-1/4 my-[0rem]'>
                                                    <label htmlFor="origin" className="block text-sm font-medium leading-6 text-custom-green pt-2">Combo Origin</label>
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
                                            <div className='my-2'>
                                                <TextArea
                                                    labelClass='translate-x-[2.5rem]'
                                                    placeholder='Combo Description...'
                                                    typeInfo='comboDesc'
                                                    name='Combo Description'
                                                    className={comboDescErr ? 'w-full block sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-red-600 ring-inset placeholder:text-gray-400 outline-red-600 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 pl-3 min-h-20 max-h-40' : "w-full min-h-20 max-h-40"}
                                                    onChange={handleDescChange}
                                                    value={comboDesc}
                                                    type='text'
                                                />
                                                {comboDescErr ? <p className='text-red-600 text-left'>{comboDescErrMsg}</p> : ""}
                                            </div>
                                        </div>

                                        <div className='block w-full md:flex md:gap-4'>
                                            <div className='w-full md:w-3/4 my-0'> {/* Adjusted width here */}
                                                <label htmlFor="items" className="block text-sm font-medium leading-6 text-custom-green">Items</label>
                                                <div className={comboNameErr ? "hidden" : ""}>
                                                    <MultiSelect
                                                        options={allProducts}
                                                        value={selectedProducts}
                                                        onChange={setSelectedProducts}
                                                        labelledBy={"Select"}
                                                        // className={comboItemErr ? 'ring-red-600 outline-red-600 w-full min-h-20 max-h-40 rounded-md border-custom-green' : "w-full min-h-20 max-h-40 rounded-md border-custom-green outline-custom-green ring-custom-green"}
                                                        overrideStrings={{
                                                            selectSomeItems: "Select Products",
                                                            allItemsAreSelected: "All Products are selected",
                                                            selectAll: "Select All",
                                                            search: "Search"
                                                        }}
                                                    />
                                                </div>
                                                <section className={!comboNameErr ? "hidden" : "block"}>
                                                    <MultiSelect
                                                        options={allProducts}
                                                        value={selectedProducts}
                                                        onChange={setSelectedProducts}
                                                        labelledBy={"Select"}
                                                        // className={comboItemErr ? 'ring-red-600 outline-red-600 w-full min-h-20 max-h-40 rounded-md border-custom-green' : "w-full min-h-20 max-h-40 rounded-md border-custom-green outline-custom-green ring-custom-green"}
                                                        overrideStrings={{
                                                            selectSomeItems: "Select Products",
                                                            allItemsAreSelected: "All Products are selected",
                                                            selectAll: "Select All",
                                                            search: "Search"
                                                        }}
                                                    />
                                                </section>
                                                {comboItemErr ? <p className='text-left text-red-600'>{comboItemErrMsg}</p> : ""}
                                            </div>
                                            <div className='w-full md:w-1/4 my-0'> {/* Adjusted width here */}
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
                                                        onChange={handleInputChange}
                                                        onBlur={handleInputBlur}
                                                        value={comboPrice}
                                                        className={comboPriceErr ? 'rounded-md block w-full border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-red-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 text-sm leading-6 outline-red-600 h-10' : "rounded-md block w-full border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-custom-green placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-custom-green text-sm leading-6 outline-custom-green h-10"}
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                                        <label htmlFor="currency" className="sr-only">Currency</label>
                                                    </div>
                                                </div>
                                                {comboPriceErr ? <p className='text-left text-red-600'>{comboPriceErrMsg}</p> : ""}
                                            </div>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <button onClick={handlePrevStep} className="bg-gray-400 text-white px-4 py-2 rounded">
                                                Previous Step
                                            </button>
                                            <button onClick={closeModal} className="bg-custom-green text-white px-4 py-2 rounded">
                                                {submitMsg}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Form >,
                document.body
            )}
        </div >
    );
}
export default ComboClient;
