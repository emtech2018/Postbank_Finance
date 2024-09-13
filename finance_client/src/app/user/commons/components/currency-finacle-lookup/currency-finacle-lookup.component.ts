import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { AddInvoiceComponent } from 'src/app/admin/modules/customer/pages/invoice-management/add-invoice/add-invoice.component';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { UraService } from 'src/app/user/data/services/customer/ura.service';
import { Invoice } from 'src/app/user/data/types/customer-types/invoice';

@Component({
  selector: 'app-currency-finacle-lookup',
  templateUrl: './currency-finacle-lookup.component.html',
  styleUrls: ['./currency-finacle-lookup.component.scss']
})
export class CurrencyFinacleLookupComponent  extends BaseComponent
implements OnInit {

displayedColumns: string[] = ["countryCode", "currencyCode", "currencyName"];

currencyCodes: any;

dataSource: MatTableDataSource<Invoice>;
isLoading = true;
selection = new SelectionModel<Invoice>(true, []);
index: number;
id: number;

@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
@ViewChild("filter", { static: true }) filter: ElementRef;
@ViewChild(MatMenuTrigger)
contextMenu: MatMenuTrigger;
contextMenuPosition = { x: "0px", y: "0px" };

noData: boolean = false;

constructor(
  public dialogRef: MatDialogRef<AddInvoiceComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private uraService: UraService
) {
  super();
}

ngOnInit(): void {
  this.getCurrencyCodes();
}

getCurrencyCodes() {
  this.isLoading = true;
  this.uraService
    .listAllFinacleCurrencies()
    .pipe(takeUntil(this.subject))
    .subscribe(
      (res) => {
        this.currencyCodes = res;

        console.log("currencyCodes: ", this.currencyCodes);

        if (this.currencyCodes.length > 0) {
          this.isLoading = false;
          this.noData = false;
        }
        if (this.currencyCodes.length === 0) {
          this.isLoading = false;
          this.noData = true;
        }

        this.dataSource = new MatTableDataSource<Invoice>(this.currencyCodes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


      },
      (err) => {
        console.log("Error: ", err);
        this.isLoading = false;
      }
    );
}

onSelectRow(data: any) {
  this.dialogRef.close({ event: "close", data: data });

  console.log(data);
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

// context menu
onContextMenu(event: MouseEvent, item: Invoice) {
  event.preventDefault();
  this.contextMenuPosition.x = event.clientX + "px";
  this.contextMenuPosition.y = event.clientY + "px";
  this.contextMenu.menuData = { item: item };
  this.contextMenu.menu.focusFirstItem("mouse");
  this.contextMenu.openMenu();
}
}
