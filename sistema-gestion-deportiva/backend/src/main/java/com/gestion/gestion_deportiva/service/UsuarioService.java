package com.gestion.gestion_deportiva.service;

import com.gestion.gestion_deportiva.entity.Usuario;
import com.gestion.gestion_deportiva.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // REGISTRAR
    public Usuario registrar(Usuario usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepository.save(usuario);
    }

    // LOGIN
    public Optional<Usuario> login(String nombreUsuario, String contrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNombreUsuario(nombreUsuario);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            if (passwordEncoder.matches(contrasena, usuario.getContrasena())) {
                return Optional.of(usuario);
            }
        }

        return Optional.empty();
    }
}