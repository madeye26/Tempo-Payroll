import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function AuthDebug() {
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      }
    };
    checkSession();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.from("users").select("*");
        if (error) throw error;
        setUsers(data || []);
        toast({
          title: "Users fetched",
          description: `Found ${data?.length || 0} users in the database`,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: `Failed to fetch users: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      if (supabase) {
        // Try to sign in with the first user in the database
        if (users.length > 0) {
          const testUser = users[0];
          const { data, error } = await supabase.auth.signInWithPassword({
            email: testUser.email,
            password: "password123", // Default test password
          });

          if (error) throw error;

          toast({
            title: "Sign in successful",
            description: `Signed in as ${data.user?.email}`,
          });

          // Refresh session
          const { data: sessionData } = await supabase.auth.getSession();
          setSession(sessionData.session);
        } else {
          toast({
            title: "No users found",
            description: "Please fetch users first or create a user",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign in failed",
        description: `Error: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    try {
      if (supabase) {
        // Create a test user
        const testEmail = `test${Date.now()}@example.com`;
        const { data, error } = await supabase.auth.signUp({
          email: testEmail,
          password: "password123",
          options: {
            data: {
              name: "Test User",
              role: "viewer",
            },
          },
        });

        if (error) throw error;

        // Import auth utils to ensure user is in public table
        const { ensureUserInPublicTable } = await import("@/lib/auth-utils");

        if (data.user) {
          await ensureUserInPublicTable(data.user);
        }

        toast({
          title: "Test user created",
          description: `Created user with email: ${testEmail}`,
        });

        // Refresh users list
        fetchUsers();
      }
    } catch (error) {
      console.error("Error creating test user:", error);
      toast({
        title: "User creation failed",
        description: `Error: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      toast({
        title: "Signed out",
        description: "Successfully signed out",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Supabase Auth Debug</h2>
        <p className="text-sm text-muted-foreground">
          Use this tool to debug Supabase authentication issues
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Connection Status</h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${supabase ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span>
              {supabase ? "Connected to Supabase" : "Not connected to Supabase"}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Current Session</h3>
          {session ? (
            <div className="bg-muted p-3 rounded text-sm">
              <p>User: {session.user?.email}</p>
              <p>
                Expires: {new Date(session.expires_at * 1000).toLocaleString()}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="mt-2"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">No active session</p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              Fetch Users
            </Button>
            <Button
              variant="outline"
              onClick={testSignIn}
              disabled={loading || users.length === 0}
            >
              Test Sign In
            </Button>
            <Button
              variant="outline"
              onClick={createTestUser}
              disabled={loading}
            >
              Create Test User
            </Button>
          </div>
        </div>

        {users.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">
              Users in Database ({users.length})
            </h3>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
