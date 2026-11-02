from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_password, hash_password, create_access_token, create_refresh_token
from app.models.models import User, Workspace
from app.schemas.schemas import UserCreate, UserLogin, Token, UserOut, UserUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    new_user = User(
        email=user_in.email.lower(),
        name=user_in.name.strip(),
        hashed_password=hash_password(user_in.password),
        role="Product Engineer",
        avatar="/avatars/avatar-1.svg",
        is_email_verified=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically create default "My Workspace" for new user
    default_ws = Workspace(
        name="My Workspace",
        description="Main product engineering and personal productivity space",
        icon="Briefcase",
        color="#5B5FEF",
        owner_id=new_user.id,
        is_default=True,
    )
    db.add(default_ws)
    db.commit()

    access_token = create_access_token(subject=new_user.id)
    user_out = UserOut.model_validate(new_user)
    user_out.workspace = default_ws.name

    return Token(access_token=access_token, user=user_out)


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    ident = credentials.email.strip().lower()
    user = (
        db.query(User)
        .filter((User.email == ident) | (User.email == f"{ident}@workpulse.app"))
        .first()
    )
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    expires = timedelta(days=7) if credentials.remember_me else timedelta(minutes=60)
    access_token = create_access_token(subject=user.id, expires_delta=expires)

    # Fetch default workspace name
    ws = db.query(Workspace).filter(Workspace.owner_id == user.id, Workspace.is_default == True).first()
    user_out = UserOut.model_validate(user)
    user_out.workspace = ws.name if ws else "My Workspace"

    return Token(access_token=access_token, user=user_out)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ws = db.query(Workspace).filter(Workspace.owner_id == current_user.id, Workspace.is_default == True).first()
    user_out = UserOut.model_validate(current_user)
    user_out.workspace = ws.name if ws else "My Workspace"
    return user_out


@router.patch("/me", response_model=UserOut)
def update_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_in.name is not None and user_in.name.strip():
        current_user.name = user_in.name.strip()
    if user_in.role is not None:
        current_user.role = user_in.role.strip()
    if user_in.avatar is not None:
        current_user.avatar = user_in.avatar.strip()
    
    db.commit()
    db.refresh(current_user)

    ws = db.query(Workspace).filter(Workspace.owner_id == current_user.id, Workspace.is_default == True).first()
    user_out = UserOut.model_validate(current_user)
    user_out.workspace = ws.name if ws else "My Workspace"
    return user_out


@router.post("/verify-email")
def verify_email(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.is_email_verified = True
    db.commit()
    return {"message": "Email verified successfully."}


@router.post("/forgot-password")
def forgot_password(payload: dict):
    # Simulated password recovery email response
    email = payload.get("email")
    return {"message": f"If an account exists for {email}, instructions have been sent."}


@router.post("/reset-password")
def reset_password(payload: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_password = payload.get("new_password")
    if not new_password or len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    current_user.hashed_password = hash_password(new_password)
    db.commit()
    return {"message": "Password successfully updated."}


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.delete(current_user)
    db.commit()
    return None


