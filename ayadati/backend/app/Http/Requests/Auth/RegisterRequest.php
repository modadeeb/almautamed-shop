<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            // رقم هاتف يمني/دولي: أرقام مع + اختيارية، 9 إلى 15 رقماً.
            'phone' => ['required', 'string', 'regex:/^\+?[0-9]{9,15}$/', 'unique:users,phone'],
            'password' => ['required', 'confirmed', Password::defaults()],
            // الدور اختياري؛ يُسمح فقط بطبيب أو مريض (admin عبر seeder).
            'role' => ['nullable', Rule::in(UserRole::selfRegisterable())],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'الاسم',
            'email' => 'البريد الإلكتروني',
            'phone' => 'رقم الهاتف',
            'password' => 'كلمة المرور',
            'role' => 'نوع الحساب',
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'رقم الهاتف غير صحيح. أدخل رقماً يمنياً صحيحاً.',
        ];
    }
}
