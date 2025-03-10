import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function DebugLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleDirectLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Check if Supabase is available
      if (!supabase) {
        setResult({
          success: false,
          message: "Supabase client is not initialized",
          details: "Check your environment variables and Supabase connection",
        });
        return;
      }

      console.log("Attempting direct Supabase login with:", email);
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log(
        "Supabase Key available:",
        !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      );

      // Try direct Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Direct Supabase login error:", error);
        setResult({
          success: false,
          message: `Login failed: ${error.message}`,
          error,
        });
      } else if (data.user) {
        console.log("Direct Supabase login successful", data.user);

        // Get user profile from database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userError) {
          console.log("User not found in public.users table, creating record");
          // Try to create a user record
          const { data: newUserData, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || email.split("@")[0],
                role: data.user.user_metadata?.role || "viewer",
                is_active: true,
                created_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (insertError) {
            setResult({
              success: true,
              message: "Login successful but failed to create user record",
              user: data.user,
              error: insertError,
            });
          } else {
            setResult({
              success: true,
              message: "Login successful and created new user record",
              user: data.user,
              userData: newUserData,
            });
          }
        } else {
          setResult({
            success: true,
            message: "Login successful",
            user: data.user,
            userData,
          });
        }

        toast({
          title: "Login successful",
          description: `Logged in as ${data.user.email}`,
        });
      } else {
        setResult({
          success: false,
          message: "No user returned from login attempt",
          data,
        });
      }
    } catch (error) {
      console.error("Error in direct login:", error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      if (!supabase) {
        setResult({
          success: false,
          message: "Supabase client is not initialized",
        });
        return;
      }

      // Create a new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split("@")[0],
            role: "viewer",
          },
        },
      });

      if (error) {
        setResult({
          success: false,
          message: `Sign up failed: ${error.message}`,
          error,
        });
      } else {
        setResult({
          success: true,
          message: "Sign up successful",
          user: data.user,
        });

        toast({
          title: "Sign up successful",
          description: `Created user with email: ${email}`,
        });
      }
    } catch (error) {
      console.error("Error in sign up:", error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Direct Supabase Login Test</h2>
        <p className="text-sm text-muted-foreground">
          Test direct Supabase authentication without going through the auth
          context
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDirectLogin} disabled={loading}>
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Test Direct Login
          </Button>
          <Button variant="outline" onClick={handleSignUp} disabled={loading}>
            Create Test User
          </Button>
        </div>

        {result && (
          <div
            className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            <h3 className="font-semibold mb-2">Result:</h3>
            <p>{result.message}</p>

            {result.user && (
              <div className="mt-2">
                <h4 className="font-semibold">User:</h4>
                <pre className="bg-black/5 p-2 rounded mt-1 overflow-auto text-xs">
                  {JSON.stringify(result.user, null, 2)}
                </pre>
              </div>
            )}

            {result.userData && (
              <div className="mt-2">
                <h4 className="font-semibold">User Data:</h4>
                <pre className="bg-black/5 p-2 rounded mt-1 overflow-auto text-xs">
                  {JSON.stringify(result.userData, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div className="mt-2">
                <h4 className="font-semibold">Error Details:</h4>
                <pre className="bg-black/5 p-2 rounded mt-1 overflow-auto text-xs">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md">
          <h3 className="font-semibold mb-2">Supabase Connection Info:</h3>
          <p>URL: {import.meta.env.VITE_SUPABASE_URL || "Not set"}</p>
          <p>
            ANON KEY:{" "}
            {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not set"}
          </p>
          <p>Supabase Client: {supabase ? "Initialized" : "Not initialized"}</p>
        </div>
      </div>
    </Card>
  );
}
