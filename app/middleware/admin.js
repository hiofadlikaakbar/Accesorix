export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient();

  // Pakai getSession langsung dari supabase, lebih reliable
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return navigateTo("/auth/signin");
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!data || data.role !== "admin") {
    return navigateTo("/");
  }
});
