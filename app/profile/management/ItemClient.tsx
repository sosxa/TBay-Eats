'use client';
import React, { useState, useCallback } from 'react';
import FormHeader from '@/app/components/forms/FormHeader';
import FormSubmitBtn from '@/app/components/forms/FormSubmitBtn';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Form from '@/app/components/forms/Form';
import Input from '@/app/components/forms/Input';
import { addProductData } from './itemUploadComponents/addProductData';
import addProductImg from './itemUploadComponents/addProductImg';

const ItemClient = () => {
  const [currentCombo, setCurrentCombo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [itemName, setItemName] = useState<string>('')
  const [itemDesc, setItemDesc] = useState<string>('')

  const [sizes, setSizes] = useState({
    small: false,
    medium: false,
    large: false
  });


  const handleStep = () =>{
    setCurrentCombo(prevState => + 1)
  }

  const handleBackStep = () =>{
    setCurrentCombo(prevState => - 1)
  }
  // const [trackSpice, setTrackSpice] = useState<any>();


  const handleItemName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(event.target.value)
  }

  const handleDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemDesc(event.target.value)
  }

  const handleSizeClick = (size: "small" | 'medium' | "large") => {
    setSizes(prevSizes => ({
      ...prevSizes,
      [size]: !prevSizes[size]
    }));
  };

  const gettingPfp = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (selectedFiles.length < 5) {
        setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
      } else {
        console.log("more than 5")
      }
    }
  };

  const submitForm = useCallback(async (formData: FormData) => {
    const duplicate = { ...sizes };
    const sizesArray = Object.values(duplicate);
    // const duplicatedFiles = selectedFiles.map(file => file);
    // console.log('Duplicated Files:', duplicatedFiles);
    // const jsonDouble = JSON.stringify(duplicatedFiles)

    selectedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    // try {
    //   await addProductData(formData, sizesArray)
    // }
    // catch (error) { console.log(error) }
    try {
      await addProductImg(formData)
    } catch (error) { console.log(error) }
  }, [sizes])


  // console.log(selectedFiles)
  return (
    <div>
      {loading ? (
        <div className='pb-4'>
          <Skeleton height={50} />
        </div>
      ) : (
        <FormHeader title="Single Items" classname='' textClass='text-custom-green' />
      )}
      {loading ? (
        <div className='pb-4'>
          <Skeleton height={50} />
        </div>
      ) : (
        <FormSubmitBtn
          className='bg-custom-yellow h-[3rem] pt-[.6rem] hover:bg-yellow-400'
          pendingText='Creating your template...'
          onClick={() => handleStep}
        >
          New Item
        </FormSubmitBtn>
      )}

      {currentCombo === 1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out">
          <div className="bg-white p-6 rounded shadow-lg z-50 w-1/2 transition-transform duration-500 ease-in-out transform translate-y-0">
            <Form className='' action={submitForm} method={''}>
              <div className='flex w-full'>
                <div>
                  <input
                    type="file"
                    name="filePfp"
                    accept="image/*"
                    multiple
                    onChange={gettingPfp}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-custom-yellow hover:file:bg-yellow-200 "
                  />
                  <div className='flex flex-wrap mt-4'>
                    {selectedFiles.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index + 1}`}
                        className='w-[100px] h-[100px] border-4 border-solid border-white rounded-full object-cover mr-2'
                      />
                    ))}

                  <button className='bg-black text-white' onClick={handleStep}>Here Here for Next</button>
                  </div>
                </div>
                {/* begin modal 2 */}
                <div className='w-1/2 block lg:float-right'>
                  <div className='pb-4'>
                    <Input name='Item name' type='text' typeInfo='item_name' value={itemName} onChange={handleItemName} className='' />
                  </div>
                  <Input name='Item Description' type='text' typeInfo='item_desc' value={itemDesc} onChange={handleDesc} />
                  {/* sizes */}
                  <div className='pt-4'>
                    <label className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Portion Sizes</label>
                    <div className='pt-4'>
                      <div className="flex">
                        <div className="flex items-center me-4">
                          <input id="inline-checkbox" type="checkbox" name="smallBox" className="w-4 h-4 bg-gray-100 border-gray-300 rounded ring-offset-gray-800 focus:ring-2" onClick={() => handleSizeClick('small')} />
                          <label htmlFor="inline-checkbox" className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Small</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="inline-2-checkbox" type="checkbox" name="mediumBox" className="w-4 h-4 text-blue-600 rounded ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" onClick={() => handleSizeClick('medium')} />
                          <label htmlFor="inline-2-checkbox" className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Medium</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="inline-3-checkbox" type="checkbox" name="largeBox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ring-offset-gray-800 focus:ring-2" onClick={() => handleSizeClick('large')} />
                          <label htmlFor="inline-checkbox" className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Large</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  {/* spice levels */}
                  <div className='pt-4'>
                    <label className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Spice level</label>
                    <div className='pt-4'>
                      <div className="flex">
                        <div className="flex items-center me-4">
                          <input id="spice-normal" name="spice-level" type="radio" value="normal" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ring-offset-gray-800 focus:ring-2" />
                          <label htmlFor="spice-normal" className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Normal</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="spice-spicy" name="spice-level" type="radio" value="spicy" className="w-4 h-4 text-blue-600 rounded ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600" />
                          <label htmlFor="spice-spicy" className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Spicy</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="spice-very-spicy" name="spice-level" type="radio" value="very-spicy" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ring-offset-gray-800 focus:ring-2" />
                          <label htmlFor="spice-very-spicy" className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">Very Spicy</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="spice-you-might-die" name="spice-level" type="radio" value="you-might-die" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ring-offset-gray-800 focus:ring-2" />
                          <label htmlFor="spice-you-might-die" className="text-custom-green block text-sm font-medium leading-none translate-x-[11%] sm:translate-x-0">You might die</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end modal 2*/}

              {loading ? (
                <div className='pb-4'>
                  <Skeleton height={50} />
                </div>
              ) : (
                <>
                  <FormSubmitBtn className='translate-y-5 h-[3rem] pt-[.6rem]' pendingText='Saving...'>
                    Save
                  </FormSubmitBtn>
                  <div className='pt-2'>
                    <FormSubmitBtn className='text-black hover:bg-white hover:text-black translate-y-5 h-[3rem] pt-[.6rem]' onClick={() => { handleBackStep }} pendingText='forgetting...'>
                      Nevermind
                    </FormSubmitBtn>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemClient;
