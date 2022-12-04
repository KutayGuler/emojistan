import supabase from "./supabase";

// TODO: subscribable currentIsland
// TODO: Get uuid type of supabase
const currentIslandID = "";

// USER SETTINGS

export async function changeUsername() {}

export async function deleteAccount() {}

// AUTH

export async function signIn() {}

export async function signOut() {}

// RELATIONS

export async function followUser() {}

export async function searchUser() {}

// GET ISLANDS

export async function getUserIslands() {}

export async function getFavoriteIslands() {}

// FAVORITES

export async function addToFavorites() {}

export async function removeFromFavorites() {}

// MODIFY SPECIFIC ISLAND DATA

export async function saveIsland() {
  const { data, error } = await supabase
    .from("islands")
    .update({ other_column: "otherValue" })
    .eq("some_column", "someValue");
}

export async function changeIslandName() {}

export async function changeIslandStatus() {}

export async function deleteIsland() {}
