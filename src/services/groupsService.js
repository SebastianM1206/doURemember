import { supabase } from "../supabase/supabaseClient.js";
import { useAuth } from '../../context/AuthContext.jsx';

export async function getGruopsByUserId() {

    const { user } = useAuth();

    return supabase
    .from("groups")
    .select("*")
    .eq("user_id", user.id);
}
