package com.gestion.gestion_deportiva.controller;

import com.gestion.gestion_deportiva.entity.Usuario;
import com.gestion.gestion_deportiva.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    //REGISTRAR USUARIO
    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioService.registrar(usuario);
    }

    // LOGIN
    @PostMapping("/login")
    public Optional<Usuario> login(@RequestBody Usuario usuario) {
        return usuarioService.login(
                usuario.getNombreUsuario(),
                usuario.getContrasena()
        );
    }

    // verificar que funciona
    @GetMapping("/test")
    public String test() {
        return "FUNCIONA";
    }
}