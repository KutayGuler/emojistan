import supabase from "./supabase";

// TODO: subscribable currentIsland
// TODO: Get uuid type of supabase
const currentIslandID = "";

// USER SETTINGS

async function changeUsername() {}

async function deleteAccount() {}

// AUTH

async function signIn() {}

async function signOut() {}

// RELATIONS

async function followUser() {}

async function searchUser() {}

// GET ISLANDS

async function getUserIslands() {}

async function getFavoriteIslands() {}

// FAVORITES

async function addToFavorites() {}

async function removeFromFavorites() {}

// MODIFY SPECIFIC ISLAND DATA

async function saveIsland() {
  const { data, error } = await supabase
    .from("islands")
    .update({ other_column: "otherValue" })
    .eq("some_column", "someValue");
}

async function changeIslandName() {}

async function changeIslandStatus() {}

async function deleteIsland() {}
