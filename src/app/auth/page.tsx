'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, initiateEmailSignUp, initiateEmailSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { User as FirebaseUser } from 'firebase/auth';

export default function AuthPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // We need to await here to get the user credential for the firestore write
      const userCredential = await initiateEmailSignUp(auth, email, password);
      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        await setDoc(doc(firestore, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: name,
          role: 'user',
        });
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    initiateEmailSignIn(auth, email, password);
  };
  
  useEffect(() => {
    const handleRedirect = async (currentUser: FirebaseUser) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/micuenta');
            }
        } else {
            // Default redirect if doc doesn't exist
            router.push('/micuenta');
        }
    };

    if (user && !isUserLoading) {
        handleRedirect(user);
    }
  }, [user, isUserLoading, firestore, router]);


  if (isUserLoading) {
    return <div>Cargando...</div>;
  }

  // We don't redirect here anymore, useEffect will handle it
  // to avoid flashing the auth page.

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">¡Bienvenido!</CardTitle>
            <CardDescription>Accede a tu cuenta o crea una nueva para empezar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="tu@email.com" required onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input id="login-password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-[#E5B80B] hover:bg-[#E5B80B] text-black border-none">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSignUp} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre</Label>
                    <Input id="register-name" placeholder="Tu Nombre" required onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="tu@email.com" required onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input id="register-password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-[#E5B80B] hover:bg-[#E5B80B] text-black border-none">
                    Crear Cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
