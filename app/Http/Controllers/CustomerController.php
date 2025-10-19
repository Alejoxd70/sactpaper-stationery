<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'document_type' => 'required|in:CC,NIT,CE,TI',
            'document_number' => 'required|unique:customers',
            'email' => 'nullable|email',
            'phone' => 'nullable',
        ]);

        Customer::create($request->all());

        return redirect()->back()->with('success', 'Cliente creado');
    }
}
