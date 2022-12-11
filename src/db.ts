import supabase from "./supabase";

// can use saves.current store
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

/**
 * Inserts a save that is stored on localstorage to database.
 */
export async function migrateIslandToServer() {}

export async function changeIslandName() {}

export async function changeIslandStatus() {}

export async function deleteIsland() {}
