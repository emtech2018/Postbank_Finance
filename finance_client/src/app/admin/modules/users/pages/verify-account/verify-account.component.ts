import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenCookieService } from 'src/app/core/service/token-storage-cookies.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { SupplierService } from 'src/app/user/data/services/supplier.service';
import { AllSuppliersComponent } from '../../../supplier/pages/suppliers-management/all-suppliers/all-suppliers.component';
import { AccountService } from '../../data/services/account.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.sass']
})
export class VerifyAccountComponent implements OnInit {
  Data: any;

  statusForm: FormGroup;
  statusTypes: string[] = ["Approve", "Reject"];
  rejected: boolean = false;
  currentUser: any;
  postedBy: any;
  canVerify: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AllSuppliersComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackbar: SnackbarService,
    private tokenCookieService: TokenCookieService
  ) {}
  ngOnInit(): void {
    this.currentUser = this.tokenCookieService.getUser().username;
    this.Data = this.data.account;

    console.log("DATA ", this.data)

    this.postedBy = this.Data.modifiedBy;

    if(this.postedBy === this.currentUser){
      this.snackbar.showNotification("snackbar-danger", "You cannot verify an account you created !")
      this.canVerify = false;      
    }else {
      this.canVerify = true;
    }

    console.log("Data: ", this.Data);
    this.statusForm = this.createStatusForm();
  }

  createStatusForm(): FormGroup {
    return this.fb.group({
      action: ["", [Validators.required]],
      username: [this.Data.username, [Validators.required]],
      verifiername: [this.currentUser, [Validators.required]],
    });
  }

 

  changeStatus() {
    console.log("Form = ", this.statusForm.value);
    const params = new HttpParams()
      .set("action", this.statusForm.value.action)
      .set("username", this.statusForm.value.username)
      .set("verifiername", this.statusForm.value.verifiername)

    this.accountService.verifyAccount(params).subscribe(
      (res) => {
        this.dialogRef.close();
        this.snackbar.showNotification(
          "snackbar-success",
          "Account verified succesfully!"
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onCancel(){
    this.dialogRef.close();
  }
}
