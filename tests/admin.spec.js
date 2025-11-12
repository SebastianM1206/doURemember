import {test, expect} from "@playwright/test"
import { create } from "domain";

const inicioSesionAdmin = async ({page}) => {
    await page.goto("http://localhost:5173/");
    const inputEmail = page.getByPlaceholder("correo@ejemplo.com");
    await expect(inputEmail).toBeVisible();
    await inputEmail.fill("admin@douremember.com");
    await expect(inputEmail).toHaveValue("admin@douremember.com");

    const inputPassword = page.getByPlaceholder("Contraseña");
    await expect(inputPassword).toBeVisible();
    await inputPassword.fill("Admin123")
    await expect(inputPassword).toHaveValue("Admin123");

    const loginButton = page.getByTestId("login-button")
    await expect(loginButton).toBeVisible();
    
    await loginButton.click();
    await expect(page).toHaveURL(/admin/);
}


test("Registro de un nuevo medico por el admin", async ({page}) => {
    await inicioSesionAdmin({page});
    
    const doctorsButton = page.getByRole('button', {name: "Médicos"});
    await expect(doctorsButton).toBeVisible();
    await doctorsButton.click();
    
    const createDoctor = page.getByRole('button', {name: "Crear Médico"});
    await expect(createDoctor).toBeVisible();
    await createDoctor.click();

    const nameInput = page.getByPlaceholder("Juan Pérez");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Muhamed Ali");
    
    const emailInput = page.getByPlaceholder("usuario@ejemplo.com");
    await expect(emailInput).toBeVisible();
    await emailInput.fill("ali@gmail.com");
    
    const passwordInput = page.getByPlaceholder("Mínimo 6 caracteres");
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill("Ali123*");

    const createButton = page.getByRole('button', {name: "Crear Usuario"});
    await expect(createButton).toBeVisible();
    await createButton.click();
});

test("Eliminacion de un paciente (Alejandro) por el admin", async ({page}) => {
    await inicioSesionAdmin({page});
    
    const patientsButton = page.getByRole('button', {name: "Pacientes"});
    await expect(patientsButton).toBeVisible();
    await patientsButton.click();

    const searchInput = page.getByPlaceholder("Buscar por nombre o correo...");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Alejandro");

    const deleteButton = page.getByTestId("delete-bucket");
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    const confirmDletion = page.getByTestId("confirm-dialog-modal");
    await expect(confirmDletion).toBeVisible();
    await confirmDletion.click();
});

test("Edicion del nombre de un paciente (Sebastian) por el admin", async ({page}) => {
    await inicioSesionAdmin({page});
    
    const patientsButton = page.getByRole('button', {name: "Pacientes"});
    await expect(patientsButton).toBeVisible();
    await patientsButton.click();

    const searchInput = page.getByPlaceholder("Buscar por nombre o correo...");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Sebastian");

    const editButton = page.getByTitle("Editar");
    await expect(editButton).toBeVisible();
    await editButton.click();

    const editNameInput = page.getByPlaceholder("Juan Pérez");
    await expect(editNameInput).toBeVisible();
    await editNameInput.fill("Sebastian Cepeda");

    const saveChangesButton = page.getByRole('button', {name: "Guardar Cambios"});
    await expect(saveChangesButton).toBeVisible();
    await saveChangesButton.click();
});