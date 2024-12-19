import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss']
})
export class UserFormComponent implements OnInit {
  user:any[]= [];
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(20),
          Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{12,20}$')
        ]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      addresses: this.fb.array([
        this.createAddress('Current Address'),
        this.createAddress('Office Address'),
        this.createAddress('Permanent Address')
      ]),
      skills: this.fb.array([this.createSkill()]),
    });
  }

  get addressControls() {
    return (this.userForm.get('addresses') as FormArray).controls;
  }

  get skillsControls() {
    return (this.userForm.get('skills') as FormArray).controls;
  }

  createAddress(addressType: string): FormGroup {
    return this.fb.group({
      addressType: [addressType],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }
  
  createSkill(): FormControl {
    return this.fb.control('',[Validators.required,Validators.pattern('^[a-zA-Z#+]*$')]);
  }

  addAddress(addressType: string): void {
    const addresses = this.userForm.get('addresses') as FormArray;
    addresses.push(this.createAddress(addressType));
  }
  
  addSkill(): void {
    const skills = this.userForm.get('skills') as FormArray;
    skills.push(this.createSkill());
  }

  reset() {
    this.userForm.reset({
      name: '',
      email: '',
      password: '',
      contact: '',
      addresses: [],
      skills: []
    });
  
    const addresses = this.userForm.get('addresses') as FormArray;
    while (addresses.length) {
      addresses.removeAt(0);
    }
  
    const skills = this.userForm.get('skills') as FormArray;
    while (skills.length) {
      skills.removeAt(0);
    }

    this.addAddress('Current Address');
    this.addAddress('Office Address');
    this.addAddress('Permanent Address');

    this.addSkill();
  
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
  }
  

  onSubmit(): void {
    if (this.userForm.valid) {
      this.user.push(this.userForm.value);
      this.reset();
      localStorage.setItem("user",JSON.stringify(this.user));
    } else {
      console.log('Form is invalid');
    }
  }
}
