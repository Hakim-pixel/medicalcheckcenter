<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required',
            'username' => 'required|unique:users',
            'password' => 'required|min:4',
            'role' => 'required'
        ]);

        $user = new User();
        $user->id = Str::uuid();
        $user->nama = $validated['nama'];
        $user->username = $validated['username'];
        $user->password = Hash::make($validated['password']);
        $user->role = $validated['role'];
        $user->save();

        return response()->json($user, 201);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
