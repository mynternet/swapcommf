import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components
import CreatedItem from "./pages/CreatedItem";
import SearchItem from "./pages/SearchItem";
import Navbar from "./components/Navbar";
import ItemDetail from "./pages/ItemDetail";
import SwapItems from "./pages/SwapItems";
import AcceptSwapItems from "./pages/AcceptSwapItems";
import SwapHistory from "./pages/SwapHistory";
import About from "./pages/About"; // Import About page
import Contact from "./pages/Contact"; // Import Contact page
import Footer from "./pages/Footer"; // Import Footer component

// Setup the link to the GraphQL server
const httpLink = createHttpLink({
  uri: "https://backend-dot-swapcomm.ue.r.appspot.com/graphql",
});

// Setup the authentication link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchItem />} />
            <Route path="/created" element={<CreatedItem />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/swap/:id/:ownerUsername" element={<SwapItems />} />
            <Route path="/accept-swap-items/:itemToChange" element={<AcceptSwapItems />} />
            <Route path="/swap-history" element={<SwapHistory />} />
            <Route path="/about" element={<About />} /> {/* About page route */}
            <Route path="/contact" element={<Contact />} /> {/* Contact page route */}
          </Routes>
          <Footer /> {/* Footer component */}
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
