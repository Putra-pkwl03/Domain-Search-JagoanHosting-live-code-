<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class DomainController extends Controller
{
    public function getConfig()
    {
        // Path ke file json yang tadi dibuat
        $path = storage_path('app/domain_config.json');

        // Cek apakah filenya ada
        if (!File::exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Config file not found.'
            ], 404);
        }

        // Baca isi file
        $file = File::get($path);
        $data = json_decode($file, true);

        // Return sebagai JSON API
        return response()->json($data);
    }
}