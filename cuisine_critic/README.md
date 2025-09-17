# Cuisine Critic 
A RESTful API for restatutant listings and reviews built with Node.js , express.js , MongoDB

POST /: Creates a new restaurant.
GET /: Retrieves a list of all restaurants.
Should support filtering by cuisine (e.g., ?cuisine=Italian).
GET /:restaurantId: Retrieves a single restaurant by its ID.
PUT /:restaurantId: Updates a restaurant's details.

Review Routes (Nested under Restaurants)
These routes should be designed to show the clear relationship between a restaurant and its reviews.

POST /api/restaurants/:restaurantId/reviews: Creates a new review for a specific restaurant. After creation, it must trigger the average rating recalculation.
GET /api/restaurants/:restaurantId/reviews: Retrieves all reviews for a specific restaurant.
DELETE /api/reviews/:reviewId: Deletes a specific review by its ID. After deletion, it must trigger the average rating recalculation for the parent restaurant.
