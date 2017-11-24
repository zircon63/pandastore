import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guard/auth.guard';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DataGridModule, ToolbarModule,
  ButtonModule, PanelModule, ProgressBarModule,
  DataListModule, GrowlModule, SliderModule,
  ListboxModule, TabViewModule, FieldsetModule, TreeTableModule, TreeNode, SharedModule, InputMaskModule,
  MessagesModule, MenubarModule, MenuItem, DataTableModule, DialogModule, InputTextareaModule, SelectButtonModule,
  ChartModule
} from 'primeng/primeng';
import { ListProductsComponent } from './components/list-products/list-products.component';
import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import { AppComponent } from './app.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthComponent } from './components/auth/auth.component';
import {CartService} from './services/cart.service';
import { FilterPipe } from './pipe/filter.pipe';
import { SearchPipe } from './pipe/search.pipe';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ShopComponent } from './components/shop/shop.component';
import {MessageService} from 'primeng/components/common/messageservice';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';
import {AdminGuard} from './guard/admin.guard';
import { CategoryComponent } from './components/admin/category/category.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { OrdersComponent } from './components/admin/orders/orders.component';
import { StatsComponent } from './components/admin/stats/stats.component';


const appRoutes: Routes = [
  { path: '', component: ShopComponent, canActivate : [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate : [AdminGuard, AuthGuard] },
  { path: 'admin/category', component: CategoryComponent, canActivate : [AdminGuard, AuthGuard] },
  { path: 'admin/products', component: ProductsComponent, canActivate : [AdminGuard, AuthGuard] },
  { path: 'admin/orders', component: OrdersComponent, canActivate : [AdminGuard, AuthGuard] },
  { path: 'admin/stats', component: StatsComponent, canActivate : [AdminGuard, AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate : [AuthGuard] },
  { path: 'auth/:action', component: AuthComponent},
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ListProductsComponent,
    CartComponent,
    AuthComponent,
    FilterPipe,
    SearchPipe,
    NotfoundComponent,
    ShopComponent,
    ProfileComponent,
    AdminComponent,
    CategoryComponent,
    ProductsComponent,
    OrdersComponent,
    StatsComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    DataGridModule,
    ToolbarModule,
    ButtonModule,
    PanelModule,
    ProgressBarModule,
    SidebarModule,
    DataListModule,
    GrowlModule,
    SliderModule,
    ListboxModule,
    FormsModule,
    HttpClientModule,
    TabViewModule,
    ReactiveFormsModule,
    FieldsetModule,
    TreeTableModule,
    SharedModule,
    InputMaskModule,
    MenubarModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    InputTextareaModule,
    SelectButtonModule,
    ChartModule
  ],
  providers: [CartService, AuthService, AuthGuard, MessageService, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
