### TBay Eats - Food Catering & Ordering Platform

Project link: https://t-bay-eats.vercel.app/
# Restaurant Owner <br />
Email: testuser41215@gmail.com <br /> Password: testuser41215 <br />

## Project Overview
TBay Eats is a food catering and ordering platform designed for restaurant owners and consumers. Restaurant owners can register their establishments, list food items, combos, and sell directly to consumers. Both restaurant owners and consumers can customize their profiles by uploading a profile picture and banner.

This project showcases a full-fledged web application where users can browse, order, and manage food services. It's designed to provide a seamless, user-friendly interface for both parties, inspired by popular food delivery platforms like UberEats, GrubHub, and Instacart.

In the summer I was looking for projects to build and ultimately I wanted to build something that allowed multiple users to come together to be able to uplaod items onto a website. This isn't meant for commercial use or anything but its great practice.

## Initial Design Process
The first step in creating TBay Eats was the design phase. I wanted to ensure that the platform was intuitive and provided a seamless user experience, much like the popular services like UberEats, GrubHub, and Instacart.

## Design Tool Used: Figma
This was my first time using Figma, and I initially faced a learning curve in understanding the basics of the tool.
Once familiar with the platform, I found it much easier to translate the concepts into visual designs, focusing on how consumers and restaurant owners would interact with the platform.
The design was centered on simplicity, ease of navigation, and delivering a visually appealing user interface. 

## Development Stack
I used NEXT.JS for the front-end and back-end, Tailwind CSS for styling, Supabase (Firebase alternative) as my database. And for APIs I only used STRIPE API for the mock checkout. 

### Features
1. User Profiles
Both restaurant owners and consumers can create and customize their profiles.
Upload profile pictures and banners to personalize their experience.
Consumers can browse restaurants, view food options, and place orders.
Restaurant owners can manage their establishments, list their menus, and handle orders.
2. Restaurant Management
Owners can register their establishments on the platform.
List and categorize food items, combos, and pricing.
Manage availability and customize offerings.
3. Order & Cart System
Consumers can browse, add items to their cart, and place orders with ease.
Restaurant owners can view incoming orders and manage them effectively.
4. Responsive Design
Fully responsive design for both desktop and mobile devices.
Clean and modern interface inspired by leading food delivery platforms.

### Struggles I've had 
## 1. Learning Next.js and Client/Server Rendering
One of the biggest challenges I faced was wrapping my head around Next.js's approach to client-side vs. server-side rendering. In Next.js 14, server components cannot be rendered inside client components; instead, client components can only be rendered within server components. This separation of concerns was initially difficult to grasp, especially since I had previous experience with full-stack JavaScript (React and Node.js) from my time at HuggleGroup, as well as working with the MERN stack. The first few days were a challenge, but as I continued developing, it became clearer how to manage what should be rendered on the server and what should be rendered on the client.

## 2. Integrating Supabase
Integrating Supabase with Next.js was generally straightforward for basic functionalities such as user registration, sign-in, password changes, and email confirmation. Storing user information and listings in tables was easy as well. However, uploading and managing images was a different story. This part of the project, which involved handling product images, profile pictures, and banners, proved more difficult than I anticipated. It took me about three days of trial and error, reading forums, and watching tutorials to figure out the best approach. Initially, I was trying to store images in a generic folder (e.g., "profile pictures"), but I quickly realized that this method made it challenging to keep track of which image belonged to which user. The solution I eventually implemented was creating a folder for each user based on their personal ID in the database. When users upload their profile pictures, they are stored within their individual folder, making it much easier to track and manage.
Also forming a relationship so that the users product information and product images were difficult at first. Since the product information is stored in the table and the product images are stored in the storage. I solved this by assigning a unique Id for ever product that is also assigned to the image. So when you click on the product listing it displays the product by fetching the id based on the product name, that id is passed onto the backend so Supabase can parse throguh the tables folder to fetch the product information, and once the product information it parses throught the storage tables folder based on the id to display the image or images(s). 

## 3. Handling Relationships Between Products and Images
Another challenge I faced was establishing a relationship between the product information (stored in tables) and the product images (stored in storage). To address this, I assigned a unique ID to each product. This ID not only linked the product details in the database but also ensured the image associated with the product could be fetched correctly from storage. The unique ID allowed me to retrieve both the product information and the corresponding images in a streamlined way. This became especially important when I added the ability for users to edit their product or combo listings. Without this unique ID, renaming a product would have caused the system to lose the link to the associated image, which was a significant issue. Assigning an ID resolved this problem and ensured the images would remain linked to their respective products, even if a user changed the product name.

## 4. Managing the Shopping Cart
The implementation of the shopping cart was also more complicated than I initially remembered, despite having worked on similar features during past projects. To manage the cart's state across the application and ensure it persisted even after a page reload, I used React’s useReducer hook. This allowed me to create a universal cart state that would not disappear upon reloading the page, solving the problem of a disappearing cart. Using useReducer provided the necessary flexibility to ensure the shopping cart functioned smoothly and intuitively for users.

### Bugs to Fix
## 1. Load More Bug on Home Page
The first issue lies with the "Load More" functionality on the homepage. Currently, when the user clicks "Load More", the entire list of previously loaded products is re-rendered, and 9 new products are added on top. This is because the backend is fetching the current amount of products in the React state array plus 9 more, causing a re-render of all products and triggering a loading animation. I plan to refactor this logic so that the previous products remain displayed, and only the new products are fetched and added to the list, improving the performance and user experience.

## 2. Restaurant Tab Not Displaying Products
The second issue occurs on the Restaurant tab, where products listed under a restaurant are not currently loading. I plan to address this by implementing the correct logic to ensure that products associated with a restaurant are properly fetched and displayed.


